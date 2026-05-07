'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAdminBlogTags } from '../../hooks'
import { parseApiError } from '../../lib/api'
import { cn } from '../../lib/utils/cn'
import type { BlogPost, BlogTag } from '../../types'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(300, 'Excerpt must be under 300 characters'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).min(1, 'Select at least one tag'),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

interface BlogPostFormProps {
  post?: BlogPost
  onSubmit: (data: BlogPostFormData) => void
  onCancel: () => void
  isPending: boolean
  error: unknown
}

export default function BlogPostForm({
  post,
  onSubmit,
  onCancel,
  isPending,
  error,
}: BlogPostFormProps) {
  const { data: tags } = useAdminBlogTags()
  const apiError = error ? parseApiError(error) : null

  const parseTagName = (tag: BlogTag | string) =>
    typeof tag === 'string' ? tag : tag.name

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      tags: post?.tags.map(parseTagName) || [],
    },
  })

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags.map(parseTagName),
      })
    }
  }, [post, reset])

  const contentValue = watch('content')
  const excerptValue = watch('excerpt')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-xl"
      noValidate
    >
      {apiError && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 
                     px-md py-md"
        >
          <p className="text-small text-red-400">{apiError.message}</p>
        </div>
      )}

      {/* Title */}
      <Input
        label="Post Title"
        type="text"
        placeholder="e.g. The Art of Ankara: A Cultural Deep Dive"
        required
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Excerpt */}
      <div className="space-y-sm">
        <label className="block text-label text-primary-white">
          Excerpt
          <span className="text-accent-gold ml-xs" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          rows={3}
          placeholder="A short summary of the post (max 300 characters)..."
          className={cn(
            'w-full bg-transparent border text-primary-white',
            'text-body px-md py-md resize-none',
            'placeholder:text-secondary-grey/60',
            'focus:outline-none transition-colors duration-150',
            errors.excerpt
              ? 'border-red-500'
              : 'border-secondary-grey/40 hover:border-secondary-grey focus:border-accent-gold'
          )}
          {...register('excerpt')}
        />
        <div className="flex items-center justify-between">
          {errors.excerpt ? (
            <p role="alert" className="text-small text-red-500">
              {errors.excerpt.message}
            </p>
          ) : (
            <span />
          )}
          <p
            className={cn(
              'text-small',
              excerptValue?.length > 280
                ? 'text-red-400'
                : 'text-secondary-grey'
            )}
          >
            {excerptValue?.length ?? 0}/300
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-sm">
        <label className="block text-label text-primary-white">
          Content
          <span className="text-accent-gold ml-xs" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          rows={16}
          placeholder="Write your story here...

Use double line breaks to separate paragraphs.

Short lines without a period at the end will render as subheadings."
          className={cn(
            'w-full bg-transparent border text-primary-white',
            'text-body px-md py-md resize-y',
            'placeholder:text-secondary-grey/60',
            'focus:outline-none transition-colors duration-150',
            'font-secondary leading-relaxed',
            errors.content
              ? 'border-red-500'
              : 'border-secondary-grey/40 hover:border-secondary-grey focus:border-accent-gold'
          )}
          {...register('content')}
        />
        {errors.content && (
          <p role="alert" className="text-small text-red-500">
            {errors.content.message}
          </p>
        )}
        <p className="text-small text-secondary-grey/60">
          {contentValue?.length ?? 0} characters
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-sm">
        <label className="block text-label text-primary-white">
          Tags
          <span className="text-accent-gold ml-xs" aria-hidden="true">
            *
          </span>
        </label>
        {tags && tags.length > 0 ? (
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div
                className="flex flex-wrap gap-sm"
                role="group"
                aria-label="Select tags"
              >
                {tags.map((tag) => {
                  const isSelected = field.value.includes(tag.name)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          field.onChange(
                            field.value.filter((name) => name !== tag.name)
                          )
                        } else {
                          field.onChange([...field.value, tag.name])
                        }
                      }}
                      aria-pressed={isSelected}
                      className={cn(
                        'px-md py-sm text-small tracking-wider uppercase',
                        'border transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-accent-gold',
                        isSelected
                          ? 'bg-accent-gold border-accent-gold text-primary-white'
                          : 'border-secondary-grey/40 text-secondary-grey hover:border-accent-gold hover:text-accent-gold'
                      )}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            )}
          />
        ) : (
          <p className="text-small text-secondary-grey">
            No tags available. Tags can be created via the API.
          </p>
        )}
        {errors.tags && (
          <p role="alert" className="text-small text-red-500">
            {errors.tags.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-md pt-md border-t border-secondary-grey/20">
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
        >
          {post ? 'Update Post' : 'Save as Draft'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
