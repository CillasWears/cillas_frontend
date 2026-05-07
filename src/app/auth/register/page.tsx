'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useRegister, useMe } from '@/hooks'
import { parseApiError } from '@/lib/api'

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { data: user } = useMe()
  const { mutate: register, isPending, error } = useRegister()

  // Redirect if already logged in
  useEffect(() => {
      if (user) {
        window.location.href = '/account'
      }
  }, [user, router])

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const apiError = error ? parseApiError(error) : null

  function onSubmit(data: RegisterFormData) {
    const { confirmPassword, ...payload } = data
    register(payload, {
      onSuccess: () => {
        window.location.href = '/account'
      },
    })
  }

  return (
    <div className="w-full max-w-md space-y-2xl">
      {/* Heading */}
      <div className="space-y-sm text-center">
        <h1 className="text-h2 text-primary-white font-primary">
          Create Account
        </h1>
        <p className="text-body text-secondary-grey">
          Join Cilla's Wears and discover premium urban-African fashion
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
          <Input
            label="First Name"
            type="text"
            placeholder="Your first name"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...formRegister('firstName')}
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Your last name"
            autoComplete="family-name"
            required
            error={errors.lastName?.message}
            {...formRegister('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...formRegister('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...formRegister('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...formRegister('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isPending}
        >
          Create Account
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-body text-secondary-grey text-center">
        Already have an account?{' '}
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