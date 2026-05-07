'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLogin } from '@/hooks';
import { parseApiError } from '@/lib/api';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState('/account');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cb = params.get('callbackUrl');
    
    if (cb && typeof cb === 'string') {
      // Validate the callback URL
      const allowedHosts = [window.location.host];
      try {
        const url = new URL(cb, window.location.origin);
        if (allowedHosts.includes(url.hostname)) {
          setCallbackUrl(cb);
          return;
        }
      } catch (e) {}
    }
    
    // Default fallback
    setCallbackUrl('/account');
  }, []);

  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const apiError = error ? parseApiError(error) : null;

  function onSubmit(data: LoginFormData) {
    console.log('Submitting login for:', data.email);
    login(data, {
      onSuccess: (response) => {
        console.log('Login success, redirecting to:', callbackUrl);
        setRedirecting(true);
        window.location.href = callbackUrl || '/account';
      },
      onError: (err) => {
        console.error('Login failed:', err);
      },
    });
  }

  return (
    <div className="w-full max-w-md space-y-2xl">

      {/* Heading */}
      <div className="space-y-sm text-center">
        <h1 className="text-h2 text-primary-white font-primary">
          Welcome Back
        </h1>
        <p className="text-body text-secondary-grey">
          Sign in to your Cilla's Wears account
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

        <div className="space-y-sm">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-small text-secondary-grey 
                         hover:text-accent-gold transition-colors duration-150
                         focus-visible:outline-none focus-visible:text-accent-gold"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isPending || redirecting}
        >
          Sign In
        </Button>
      </form>

      {/* Register Link */}
      <p className="text-body text-secondary-grey text-center">
        Don't have an account?{' '}
        <Link
          href="/auth/register"
          className="text-accent-gold hover:text-accent-gold/80 
                     transition-colors duration-150
                     focus-visible:outline-none focus-visible:underline"
        >
          Create one
        </Link>
      </p>

    </div>
  );
}