'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useResetPassword } from '@/hooks'
import { parseApiError } from '@/lib/api'

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [success, setSuccess] = useState(false)

  const { mutate: resetPassword, isPending, error } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const apiError = error ? parseApiError(error) : null

  function onSubmit(data: ResetPasswordFormData) {
    if (!token) return
    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setSuccess(true)
          setTimeout(() => router.replace('/auth/login'), 3000)
        },
      }
    )
  }

  // No token in URL
  if (!token) {
    return (
      <div className="w-full max-w-md space-y-xl text-center">
        <h1 className="text-h2 text-primary-white font-primary">
          Invalid Reset Link
        </h1>
        <p className="text-body text-secondary-grey">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-small text-accent-gold hover:text-accent-gold/80
                     transition-colors duration-150"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="w-full max-w-md space-y-xl text-center">
        <div
          className="w-16 h-16 rounded-full border-2 border-accent-gold 
                     flex items-center justify-center mx-auto"
          aria-hidden="true"
        >
          <span className="text-accent-gold text-h3">✓</span>
        </div>
        <h1 className="text-h2 text-primary-white font-primary">
          Password Reset
        </h1>
        <p className="text-body text-secondary-grey">
          Your password has been reset successfully.{' '}
          Redirecting you to sign in...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-2xl">
      {/* Heading */}
      <div className="space-y-sm text-center">
        <h1 className="text-h2 text-primary-white font-primary">
          Reset Password
        </h1>
        <p className="text-body text-secondary-grey">
          Enter your new password below
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div
          role="alert"
          className="border border-red-500/40 bg-red-500/10 
                     px-md py-md rounded-sm"
        >
          <p className="text-small text-red-400">{apiError.message}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-lg"
        noValidate
      >
        <Input
          suppressHydrationWarning
          label="New Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          suppressHydrationWarning
          label="Confirm New Password"
          type="password"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isPending}
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md space-y-lg text-center">
          <p className="text-body text-secondary-grey">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
