'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
 useAdminProducts,
 useCreateProduct,
 useUpdateProduct,
 useDeleteProduct,
} from '@/hooks'
import ProductForm from '@/components/admin/ProductForm'
import ProductImageUpload from '@/components/admin/ProductImageUpload'
import ProductVariantManager from '@/components/admin/ProductVariantManager'
import CompleteProductStep from '@/components/admin/CompleteProductStep'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import type { ProductSummary } from '@/types'

type Mode = 'list' | 'create' | 'edit' | 'images'

export default function AdminProductsPage() {
 const [page, setPage] = useState(1)
 const [mode, setMode] = useState<Mode>('list')
 const [selectedProduct, setSelectedProduct] =
  useState<ProductSummary | null>(null)
 const [deletingId, setDeletingId] = useState<string | null>(null)
 const [createdProductId, setCreatedProductId] = useState<string | null>(
  null
 )

 const { data, isLoading } = useAdminProducts(page)
 const {
  mutate: createProduct,
  isPending: isCreating,
  error: createError,
 } = useCreateProduct()
 const {
  mutate: updateProduct,
  isPending: isUpdating,
  error: updateError,
 } = useUpdateProduct()
 const { mutate: deleteProduct, isPending: isDeleting } =
  useDeleteProduct()

 const products = data?.data ?? []
 const meta = data?.meta

 function handleCreate(formData: any) {
  createProduct(formData, {
   onSuccess: (newProduct) => {
    setCreatedProductId(newProduct.id)
    setMode('images')
   },
  })
 }

 function handleUpdate(formData: any) {
  if (!selectedProduct) return
  updateProduct(
   { id: selectedProduct.id, payload: formData },
   { onSuccess: () => setMode('list') }
  )
 }

 function handleDelete(id: string) {
  setDeletingId(id)
  deleteProduct(id, {
   onSettled: () => setDeletingId(null),
  })
 }

 if (isLoading) {
  return (
   <div className="space-y-md">
    {Array.from({ length: 5 }).map((_, i) => (
     <Skeleton key={i} className="h-16 w-full" />
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
      Products
     </h2>
     <p className="text-small text-secondary-grey">
      {meta?.total ?? 0} total products
     </p>
    </div>
    {mode === 'list' && (
     <Button
      variant="primary"
      onClick={() => {
       setSelectedProduct(null)
       setMode('create')
      }}
     >
      <Plus size={16} strokeWidth={1.5} className="mr-sm" />
      Add Product
     </Button>
    )}
   </div>

   {/* Create Form */}
   {mode === 'create' && (
    <div className="space-y-lg">
     <h3 className="text-h3 text-primary-white font-primary">
      New Product
     </h3>
     <ProductForm
      onSubmit={handleCreate}
      onCancel={() => setMode('list')}
      isPending={isCreating}
      error={createError}
     />
    </div>
   )}

   {/* Edit Form */}
   {mode === 'edit' && selectedProduct && (
    <div className="space-y-2xl">
     <h3 className="text-h3 text-primary-white font-primary">
      Edit Product
     </h3>
     <ProductForm
      product={selectedProduct as any}
      onSubmit={handleUpdate}
      onCancel={() => setMode('list')}
      isPending={isUpdating}
      error={updateError}
     />
     {/* Variant + Image management for existing product */}
     <div className="border-t border-secondary-grey/20 pt-2xl">
      <ProductVariantManager
       productId={selectedProduct.id}
       productSlug={selectedProduct.slug}
      />
     </div>
     <div className="border-t border-secondary-grey/20 pt-2xl">
      <ProductImageUpload
       productId={selectedProduct.id}
       existingImages={selectedProduct.images}
       onDone={() => setMode('list')}
      />
     </div>
    </div>
   )}

   {/* Complete Product Step — variants + images after creation */}
   {mode === 'images' && createdProductId && (
    <CompleteProductStep
     productId={createdProductId}
     onDone={() => {
      setCreatedProductId(null)
      setMode('list')
     }}
    />
   )}

   {/* Products Table */}
   {mode === 'list' && (
    <>
     {products.length === 0 ? (
      <div
       className="flex flex-col items-center justify-center
                  py-3xl border border-secondary-grey/20 
                  text-center space-y-lg"
      >
       <p className="text-h3 text-primary-white font-primary">
        No products yet
       </p>
       <Button
        variant="primary"
        onClick={() => setMode('create')}
       >
        Add Your First Product
       </Button>
      </div>
     ) : (
      <div className="space-y-md">
       {products.map((product) => (
        <div
         key={product.id}
         className={cn(
          'flex items-center justify-between gap-md',
          'p-lg border border-secondary-grey/20',
          'transition-opacity duration-150',
          deletingId === product.id &&
           'opacity-50 pointer-events-none'
         )}
        >
         <div className="space-y-xs flex-1 min-w-0">
          <p className="text-body text-primary-white truncate">
           {product.name}
          </p>
          <p className="text-small text-secondary-grey">
           ₦{product.basePrice.toLocaleString()}
          </p>
         </div>

         <div className="flex items-center gap-md flex-shrink-0">
          <button
           onClick={() => {
            setSelectedProduct(product)
            setMode('edit')
           }}
           aria-label={`Edit ${product.name}`}
           className="text-secondary-grey hover:text-accent-gold
                      transition-colors duration-150
                      focus-visible:outline-none
                      focus-visible:text-accent-gold"
          >
           <Pencil size={16} strokeWidth={1.5} />
          </button>
          <button
           onClick={() => handleDelete(product.id)}
           disabled={isDeleting}
           aria-label={`Delete ${product.name}`}
           className="text-secondary-grey hover:text-red-400
                      transition-colors duration-150
                      focus-visible:outline-none
                      focus-visible:text-red-400
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
