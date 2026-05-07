'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useCategories } from '@/hooks'
import { parseApiError } from '@/lib/api'
import type { Product } from '@/types'

const productSchema = z.object({
 name: z.string().min(1, 'Product name is required'),
 description: z.string().min(1, 'Description is required'),
 basePrice: z
  .number()
  .min(1, 'Price must be greater than 0'),
 categoryId: z.string().min(1, 'Category is required'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
 product?: Product
 onSubmit: (data: ProductFormData) => void
 onCancel: () => void
 isPending: boolean
 error: unknown
}

export default function ProductForm({
 product,
 onSubmit,
 onCancel,
 isPending,
 error,
}: ProductFormProps) {
 const { data: categories } = useCategories()
 const apiError = error ? parseApiError(error) : null

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
 } = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
  defaultValues: {
   name: product?.name || '',
   description: product?.description || '',
   basePrice: product?.basePrice || 0,
   categoryId: product?.category?.id || '',
  },
 })

 useEffect(() => {
  if (product) {
   reset({
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    categoryId: product.category?.id || '',
   })
  }
 }, [product, reset])

 return (
  <form
   onSubmit={handleSubmit(onSubmit)}
   className="space-y-lg"
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

   <Input
    label="Product Name"
    type="text"
    placeholder="e.g. Ankara Blazer"
    required
    error={errors.name?.message}
    {...register('name')}
   />

   <div className="space-y-sm">
    <label className="block text-label text-primary-white">
     Description
     <span className="text-accent-gold ml-xs" aria-hidden="true">
      *
     </span>
    </label>
    <textarea
     rows={4}
     placeholder="Describe the product..."
     className="w-full bg-transparent border border-secondary-grey/40
                text-primary-white text-body px-md py-md resize-none
                placeholder:text-secondary-grey/60
                hover:border-secondary-grey focus:outline-none
                focus:border-accent-gold transition-colors duration-150"
     {...register('description')}
    />
    {errors.description && (
     <p role="alert" className="text-small text-red-500">
      {errors.description.message}
     </p>
    )}
   </div>

   <Input
    label="Base Price (₦)"
    type="number"
    placeholder="e.g. 25000"
    required
    error={errors.basePrice?.message}
    {...register('basePrice', { valueAsNumber: true })}
   />

   <div className="space-y-sm">
    <label className="block text-label text-primary-white">
     Category
     <span className="text-accent-gold ml-xs" aria-hidden="true">
      *
     </span>
    </label>
    <select
     className="w-full bg-primary-black border border-secondary-grey/40
                text-primary-white text-body px-md py-md
                hover:border-secondary-grey focus:outline-none
                focus:border-accent-gold transition-colors duration-150
                cursor-pointer"
     {...register('categoryId')}
    >
     <option value="">Select a category</option>
     {categories?.map((cat) => (
      <option key={cat.id} value={cat.id}>
       {cat.name}
      </option>
     ))}
    </select>
    {errors.categoryId && (
     <p role="alert" className="text-small text-red-500">
      {errors.categoryId.message}
     </p>
    )}
   </div>

   <div className="flex gap-md">
    <Button
     type="submit"
     variant="primary"
     isLoading={isPending}
    >
     {product ? 'Update Product' : 'Create Product'}
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
