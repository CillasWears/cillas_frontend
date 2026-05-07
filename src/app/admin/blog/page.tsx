'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react'
import {
  useAdminBlogPosts,
  useAdminBlogTags,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  usePublishBlogPost,
  useUnpublishBlogPost,
} from '../../../hooks'
import BlogPostForm from '../../../components/admin/BlogPostForm'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Pagination from '../../../components/ui/Pagination'
import { Skeleton } from '../../../components/ui/Skeleton'
import { cn } from '../../../lib/utils/cn'
import type { BlogPostSummary, BlogTag } from '../../../types'

type Mode = 'list' | 'create' | 'edit'

function getTagLabel(tag: BlogTag | string, tags?: BlogTag[]) {
  if (typeof tag === 'string') {
    return tags?.find((item) => item.id === tag)?.name ?? tag
  }
  return tag.name
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminBlogPage() {
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<Mode>('list')
  const [selectedPost, setSelectedPost] =
    useState<BlogPostSummary | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { data, isLoading } = useAdminBlogPosts(page)
  const { data: adminTags } = useAdminBlogTags()
  const {
    mutate: createPost,
    isPending: isCreating,
    error: createError,
  } = useCreateBlogPost()
  const {
    mutate: updatePost,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateBlogPost()
  const { mutate: deletePost, isPending: isDeleting } =
    useDeleteBlogPost()
  const { mutate: publishPost } = usePublishBlogPost()
  const { mutate: unpublishPost } = useUnpublishBlogPost()

  const posts = data?.data ?? []
  const meta = data?.meta

  function handleCreate(formData: any) {
    createPost(formData, {
      onSuccess: () => setMode('list'),
    })
  }

  function handleUpdate(formData: any) {
    if (!selectedPost) return
    updatePost(
      { id: selectedPost.id, payload: formData },
      { onSuccess: () => setMode('list') }
    )
  }

  function handleDelete(id: string) {
    setDeletingId(id)
    deletePost(id, {
      onSettled: () => setDeletingId(null),
    })
  }

  function handleTogglePublish(post: BlogPostSummary) {
    setTogglingId(post.id)
    const isPublished = post.status === 'PUBLISHED'

    if (isPublished) {
      unpublishPost(post.id, {
        onSettled: () => setTogglingId(null),
      })
    } else {
      publishPost(post.id, {
        onSettled: () => setTogglingId(null),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2xl">

      {/* Header */}
      <div
        className="flex items-center justify-between gap-md
                   pb-lg border-b border-secondary-grey/20"
      >
        <div className="space-y-xs">
          <h2 className="text-h3 text-primary-white font-primary">
            Blog Posts
          </h2>
          <p className="text-small text-secondary-grey">
            {meta?.total ?? 0} total posts
          </p>
        </div>
        {mode === 'list' && (
          <Button
            variant="primary"
            onClick={() => {
              setSelectedPost(null)
              setMode('create')
            }}
          >
            <Plus
              size={16}
              strokeWidth={1.5}
              className="mr-sm"
              aria-hidden="true"
            />
            New Post
          </Button>
        )}
      </div>

      {/* Create Form */}
      {mode === 'create' && (
        <div className="space-y-lg">
          <h3 className="text-h3 text-primary-white font-primary">
            New Blog Post
          </h3>
          <BlogPostForm
            onSubmit={handleCreate}
            onCancel={() => setMode('list')}
            isPending={isCreating}
            error={createError}
          />
        </div>
      )}

      {/* Edit Form */}
      {mode === 'edit' && selectedPost && (
        <div className="space-y-lg">
          <h3 className="text-h3 text-primary-white font-primary">
            Edit Post
          </h3>
          <BlogPostForm
            post={selectedPost as any}
            onSubmit={handleUpdate}
            onCancel={() => setMode('list')}
            isPending={isUpdating}
            error={updateError}
          />
        </div>
      )}

      {/* Posts List */}
      {mode === 'list' && (
        <>
          {posts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center
                         py-3xl border border-secondary-grey/20 
                         text-center space-y-lg"
            >
              <BookOpen
                size={48}
                strokeWidth={1}
                className="text-secondary-grey/40"
                aria-hidden="true"
              />
              <p className="text-h3 text-primary-white font-primary">
                No posts yet
              </p>
              <Button
                variant="primary"
                onClick={() => setMode('create')}
              >
                Write Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-md">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    'flex items-start justify-between gap-md',
                    'p-lg border border-secondary-grey/20',
                    'transition-opacity duration-150',
                    (deletingId === post.id ||
                      togglingId === post.id) &&
                      'opacity-50 pointer-events-none'
                  )}
                >
                  {/* Post Info */}
                  <div className="space-y-sm flex-1 min-w-0">
                    <div className="flex items-center gap-md flex-wrap">
                      <p
                        className="text-body text-primary-white 
                                   truncate"
                      >
                        {post.title}
                      </p>
                      <Badge
                        label={
                          post.status === 'PUBLISHED'
                            ? 'Published'
                            : 'Draft'
                        }
                        variant={
                          post.status === 'PUBLISHED'
                            ? 'gold'
                            : 'default'
                        }
                      />
                    </div>
                    <p className="text-small text-secondary-grey 
                                  line-clamp-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-md flex-wrap">
                      <p className="text-small text-secondary-grey/60">
                        {formatDate(post.createdAt)}
                      </p>
                      {(post.tags as Array<BlogTag | string>)
                        .slice(0, 2)
                        .map((tag) => (
                          <span
                            key={typeof tag === 'string' ? tag : tag.id}
                            className="text-small text-secondary-grey/60"
                          >
                            #{getTagLabel(tag, adminTags)}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-md flex-shrink-0"
                  >
                    {/* Publish/Unpublish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(post)}
                      disabled={isDeleting || !!togglingId}
                      aria-label={
                        post.status === 'PUBLISHED'
                          ? `Unpublish ${post.title}`
                          : `Publish ${post.title}`
                      }
                      className={cn(
                        'transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-accent-gold',
                        'disabled:opacity-40',
                        post.status === 'PUBLISHED'
                          ? 'text-accent-gold hover:text-secondary-grey'
                          : 'text-secondary-grey hover:text-accent-gold'
                      )}
                    >
                      {post.status === 'PUBLISHED' ? (
                        <EyeOff size={16} strokeWidth={1.5} />
                      ) : (
                        <Eye size={16} strokeWidth={1.5} />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedPost(post)
                        setMode('edit')
                      }}
                      aria-label={`Edit ${post.title}`}
                      className="text-secondary-grey hover:text-accent-gold
                                 transition-colors duration-150
                                 focus-visible:outline-none
                                 focus-visible:ring-2
                                 focus-visible:ring-accent-gold"
                    >
                      <Pencil size={16} strokeWidth={1.5} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting}
                      aria-label={`Delete ${post.title}`}
                      className="text-secondary-grey hover:text-red-400
                                 transition-colors duration-150
                                 focus-visible:outline-none
                                 focus-visible:ring-2
                                 focus-visible:ring-accent-gold
                                 disabled:opacity-40"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                />
              )}
            </div>
          )}
        </>
      )}

    </div>
  )
}
