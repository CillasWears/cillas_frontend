'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Metadata } from 'next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useUserProfile as useMe, useUpdateProfile } from '@/hooks/useUsers'
import { parseApiError } from '@/lib/api'

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: user } = useMe()
  const { mutate: updateProfile, isPending, error, isSuccess } =
    useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  })

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }
  }, [user, reset])

  const apiError = error ? parseApiError(error) : null

  function onSubmit(data: ProfileFormData) {
    updateProfile(data)
  }

  return (
    <div className="space-y-2xl">

      {/* Section Header */}
      <div className="space-y-sm pb-lg border-b border-secondary-grey/20">
        <h2 className="text-h3 text-primary-white font-primary">
          Profile Information
        </h2>
        <p className="text-body text-secondary-grey">
          Update your personal details
        </p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div
          role="status"
          className="border border-accent-gold/40 bg-accent-gold/10 
                     px-md py-md"
        >
          <p className="text-small text-accent-gold">
            Profile updated successfully.
          </p>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 
                     px-md py-md"
        >
          <p className="text-small text-red-400">{apiError.message}</p>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-lg max-w-md"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
          <Input
            label="First Name"
            type="text"
            placeholder="Your first name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Your last name"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Email — read only */}
        <div className="space-y-sm">
          <label className="block text-label text-primary-white">
            Email Address
          </label>
          <div
            className="w-full bg-secondary-grey/10 border 
                       border-secondary-grey/20 text-secondary-grey 
                       text-body px-md py-md"
          >
            {user?.email}
          </div>
          <p className="text-small text-secondary-grey/60">
            Email address cannot be changed
          </p>
        </div>

        {/* Role Badge */}
        <div className="space-y-sm">
          <label className="block text-label text-primary-white">
            Account Type
          </label>
          <div className="inline-flex">
            <span
              className={`px-md py-sm text-small tracking-wider 
                         uppercase ${
                           user?.role === 'ADMIN'
                             ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                             : 'bg-secondary-grey/10 text-secondary-grey border border-secondary-grey/20'
                         }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </form>

    </div>
  )
}