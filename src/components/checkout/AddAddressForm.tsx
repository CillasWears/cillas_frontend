'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAddAddress } from '@/hooks'
import { parseApiError } from '@/lib/api'

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddAddressFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddAddressForm({
  onSuccess,
  onCancel,
}: AddAddressFormProps) {
  const { mutate: addAddress, isPending, error } = useAddAddress()
  const apiError = error ? parseApiError(error) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Nigeria' },
  })

  function onSubmit(data: AddressFormData) {
    addAddress(data, { onSuccess })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-lg border border-secondary-grey/20 p-xl"
      noValidate
    >
      <h3 className="text-h3 text-primary-white font-primary">
        Add New Address
      </h3>

      {apiError && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 px-md py-md"
        >
          <p className="text-small text-red-400">{apiError.message}</p>
        </div>
      )}

      <Input
        label="Street Address"
        type="text"
        placeholder="123 Victoria Island"
        required
        error={errors.street?.message}
        {...register('street')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <Input
          label="City"
          type="text"
          placeholder="Lagos"
          required
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="State"
          type="text"
          placeholder="Lagos State"
          required
          error={errors.state?.message}
          {...register('state')}
        />
      </div>

      <Input
        label="Country"
        type="text"
        placeholder="Nigeria"
        required
        error={errors.country?.message}
        {...register('country')}
      />

      <div className="flex items-center gap-sm">
        <input
          type="checkbox"
          id="isDefault"
          {...register('isDefault')}
          className="w-4 h-4 accent-accent-gold cursor-pointer"
        />
        <label
          htmlFor="isDefault"
          className="text-small text-secondary-grey cursor-pointer"
        >
          Set as default address
        </label>
      </div>

      <div className="flex gap-md">
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
        >
          Save Address
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
