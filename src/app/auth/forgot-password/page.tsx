'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useForgotPassword } from '@/hooks'
import { parseApiError } from '@/lib/api'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const { mutate: forgotPassword, isPending, error } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const apiError = error ? parseApiError(error) : null

  function onSubmit(data: ForgotPasswordFormData) {
    forgotPassword(data, {
      onSuccess: () => {
        setSubmitted(true)
      },
    })
  }

  // Success state
  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-xl text-center">
        <div className="space-y-md">
          <div
            className="w-16 h-16 rounded-full border-2 border-accent-gold 
                       flex items-center justify-center mx-auto"
            aria-hidden="true"
          >
            <span className="text-accent-gold text-h3">✓</span>
          </div>
          <h1 className="text-h2 text-primary-white font-primary">
            Check Your Email
          </h1>
          <p className="text-body text-secondary-grey">
            We sent a password reset link to{' '}
            <span className="text-primary-white">{getValues('email')}</span>.
            Check your inbox and follow the instructions.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-small text-accent-gold hover:text-accent-gold/80
                     transition-colors duration-150 
                     focus-visible:outline-none focus-visible:underline"
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-2xl">
      {/* Heading */}
      <div className="space-y-sm text-center">
        <h1 className="text-h2 text-primary-white font-primary">
          Forgot Password
        </h1>
        <p className="text-body text-secondary-grey">
          Enter your email and we'll send you a reset link
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
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isPending}
        >
          Send Reset Link
        </Button>
      </form>

      {/* Back to Login */}
      <p className="text-body text-secondary-grey text-center">
        Remember your password?{' '}
        <Link
          href="/auth/login"
          className="text-accent-gold hover:text-accent-gold/80 
                     transition-colors duration-150
                     focus-visible:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}