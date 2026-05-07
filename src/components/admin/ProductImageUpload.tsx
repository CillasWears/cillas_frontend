'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImagePlus } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAddProductImage, useDeleteProductImage } from '@/hooks'
import { parseApiError } from '@/lib/api'
import { cn } from '@/lib/utils/cn'
import type { ProductImage } from '@/types'

interface ProductImageUploadProps {
 productId: string
 existingImages?: ProductImage[]
 onDone: () => void
}

interface PendingImage {
 file: File
 preview: string
 altText: string
}

export default function ProductImageUpload({
 productId,
 existingImages = [],
 onDone,
}: ProductImageUploadProps) {
 const fileInputRef = useRef<HTMLInputElement>(null)
 const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
 const [uploadingIndex, setUploadingIndex] = useState<number | null>(
  null
 )
 const [uploadedCount, setUploadedCount] = useState(0)
 const [error, setError] = useState<string | null>(null)

 const { mutateAsync: addImage } = useAddProductImage()
 const { mutate: deleteImage, isPending: isDeleting } =
  useDeleteProductImage()

 function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files || [])
  if (files.length === 0) return

  const newPending: PendingImage[] = files.map((file) => ({
   file,
   preview: URL.createObjectURL(file),
   altText: '',
  }))

  setPendingImages((prev) => [...prev, ...newPending])

  // Reset file input
  if (fileInputRef.current) {
   fileInputRef.current.value = ''
  }
 }

 function handleAltTextChange(index: number, altText: string) {
  setPendingImages((prev) =>
   prev.map((img, i) => (i === index ? { ...img, altText } : img))
  )
 }

 function handleRemovePending(index: number) {
  setPendingImages((prev) => {
   const updated = [...prev]
   URL.revokeObjectURL(updated[index].preview)
   updated.splice(index, 1)
   return updated
  })
 }

 async function handleUploadAll() {
  setError(null)
  let successCount = 0

  for (let i = 0; i < pendingImages.length; i++) {
   const pending = pendingImages[i]
   setUploadingIndex(i)

   try {
    await addImage({
     productId,
     file: pending.file,
     altText: pending.altText || undefined,
     position: existingImages.length + i,
    })
    successCount++
   } catch (err) {
    const apiError = parseApiError(err)
    setError(
     `Failed to upload image ${i + 1}: ${apiError.message}`
    )
    break
   }
  }

  setUploadingIndex(null)
  setUploadedCount(successCount)

  if (successCount === pendingImages.length) {
   setPendingImages([])
  }
 }

 function handleDeleteExisting(imageId: string) {
  deleteImage({ productId, imageId })
 }

 const isUploading = uploadingIndex !== null

 return (
  <div className="space-y-2xl">

   {/* Header */}
   <div className="space-y-sm">
    <h3 className="text-h3 text-primary-white font-primary">
     Product Images
    </h3>
    <p className="text-body text-secondary-grey">
     Upload high-quality product images. The first image will be 
     used as the primary display image.
    </p>
   </div>

   {/* Existing Images */}
   {existingImages.length > 0 && (
    <div className="space-y-md">
     <p className="text-label text-secondary-grey">
      Uploaded Images ({existingImages.length})
     </p>
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
      {existingImages.map((image, index) => (
       <div
        key={image.id}
        className="relative group aspect-square 
                   bg-secondary-grey/10 overflow-hidden"
       >
        <Image
         src={image.url}
         alt={image.altText || `Product image ${index + 1}`}
         fill
         className="object-cover object-center"
         sizes="150px"
        />
        {/* Delete overlay */}
        <div
         className="absolute inset-0 bg-primary-black/60 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-150
                    flex items-center justify-center"
        >
         <button
          onClick={() => handleDeleteExisting(image.id!)}
          disabled={isDeleting}
          aria-label={`Delete image ${index + 1}`}
          className="text-primary-white hover:text-red-400
                     transition-colors duration-150
                     focus-visible:outline-none
                     focus-visible:text-red-400"
         >
          <X size={20} strokeWidth={1.5} />
         </button>
        </div>
        {/* Primary badge */}
        {index === 0 && (
         <div
          className="absolute top-sm left-sm bg-accent-gold 
                     px-sm py-xs"
         >
          <span className="text-small text-primary-white"
                style={{ fontSize: '10px' }}>
           Primary
          </span>
         </div>
        )}
       </div>
      ))}
     </div>
    </div>
   )}

   {/* Upload Area */}
   <div className="space-y-md">
    <p className="text-label text-secondary-grey">
     Add New Images
    </p>

    {/* Drop Zone */}
    <button
     onClick={() => fileInputRef.current?.click()}
     disabled={isUploading}
     className={cn(
      'w-full border-2 border-dashed border-secondary-grey/40',
      'hover:border-accent-gold transition-colors duration-150',
      'flex flex-col items-center justify-center gap-md',
      'py-2xl px-lg text-center',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-accent-gold',
      'disabled:opacity-40 disabled:cursor-not-allowed'
     )}
     aria-label="Select images to upload"
    >
     <ImagePlus
      size={32}
      strokeWidth={1}
      className="text-secondary-grey"
      aria-hidden="true"
     />
     <div className="space-y-xs">
      <p className="text-body text-primary-white">
       Click to select images
      </p>
      <p className="text-small text-secondary-grey">
       JPG, PNG, WebP supported. Multiple files allowed.
      </p>
     </div>
    </button>

    {/* Hidden File Input */}
    <input
     ref={fileInputRef}
     type="file"
     accept="image/jpeg,image/png,image/webp"
     multiple
     onChange={handleFileSelect}
     className="hidden"
     aria-hidden="true"
    />
   </div>

   {/* Pending Images Preview */}
   {pendingImages.length > 0 && (
    <div className="space-y-md">
     <p className="text-label text-secondary-grey">
      Ready to Upload ({pendingImages.length})
     </p>

     <div className="space-y-md">
      {pendingImages.map((pending, index) => (
       <div
        key={index}
        className={cn(
         'flex items-start gap-md p-md border',
         'border-secondary-grey/20',
         uploadingIndex === index &&
          'border-accent-gold animate-pulse'
        )}
       >
        {/* Preview */}
        <div
         className="relative w-20 h-20 flex-shrink-0 
                    bg-secondary-grey/10 overflow-hidden"
        >
         <Image
          src={pending.preview}
          alt={`Preview ${index + 1}`}
          fill
          className="object-cover object-center"
          sizes="80px"
         />
         {uploadingIndex === index && (
          <div
           className="absolute inset-0 bg-primary-black/60 
                      flex items-center justify-center"
          >
           <div
            className="w-6 h-6 border-2 border-accent-gold 
                       border-t-transparent rounded-full 
                       animate-spin"
            aria-hidden="true"
           />
          </div>
         )}
        </div>

        {/* Alt Text + Remove */}
        <div className="flex-1 space-y-sm">
         <p className="text-small text-secondary-grey truncate">
          {pending.file.name}
         </p>
         <input
          type="text"
          placeholder="Alt text (optional)"
          value={pending.altText}
          onChange={(e) =>
           handleAltTextChange(index, e.target.value)
          }
          disabled={isUploading}
          className="w-full bg-transparent border 
                     border-secondary-grey/40
                     text-primary-white text-small 
                     px-sm py-xs
                     placeholder:text-secondary-grey/60
                     focus:outline-none focus:border-accent-gold
                     transition-colors duration-150
                     disabled:opacity-40"
          aria-label={`Alt text for image ${index + 1}`}
         />
        </div>

        {/* Remove */}
        <button
         onClick={() => handleRemovePending(index)}
         disabled={isUploading}
         aria-label={`Remove image ${index + 1}`}
         className="text-secondary-grey hover:text-red-400
                    transition-colors duration-150 flex-shrink-0
                    focus-visible:outline-none
                    disabled:opacity-40"
        >
         <X size={16} strokeWidth={1.5} />
        </button>
       </div>
      ))}
     </div>

     {/* Upload Progress */}
     {isUploading && (
      <p
       className="text-small text-accent-gold"
       aria-live="polite"
      >
       Uploading image {(uploadingIndex ?? 0) + 1} of{' '}
       {pendingImages.length}...
      </p>
     )}

     {/* Success Count */}
     {uploadedCount > 0 && !isUploading && (
      <p
       className="text-small text-accent-gold"
       role="status"
       aria-live="polite"
      >
       {uploadedCount} image{uploadedCount > 1 ? 's' : ''} 
       uploaded successfully.
      </p>
     )}

     {/* Error */}
     {error && (
      <div
       role="alert"
       className="border border-red-500/40 bg-red-500/10 
                  px-md py-sm"
      >
       <p className="text-small text-red-400">{error}</p>
      </div>
     )}
    </div>
   )}

   {/* Action Buttons */}
   <div className="flex items-center gap-md flex-wrap pt-md 
                   border-t border-secondary-grey/20">
    {pendingImages.length > 0 && (
     <Button
      variant="primary"
      isLoading={isUploading}
      onClick={handleUploadAll}
     >
      <Upload
       size={16}
       strokeWidth={1.5}
       className="mr-sm"
       aria-hidden="true"
      />
      Upload {pendingImages.length} Image
      {pendingImages.length > 1 ? 's' : ''}
     </Button>
    )}
    <Button
     variant={pendingImages.length > 0 ? 'secondary' : 'primary'}
     onClick={onDone}
     disabled={isUploading}
    >
     {existingImages.length === 0 && pendingImages.length === 0
      ? 'Skip for Now'
      : 'Done'}
    </Button>
   </div>

  </div>
 )
}
