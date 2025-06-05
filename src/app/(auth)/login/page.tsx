'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '@/lib/validations/auth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (result?.error) {
        // Handle specific error messages
        let errorMessage = 'Invalid email or password';
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password';
        } else if (result.error === 'EmailNotVerified') {
          errorMessage = 'Please verify your email before signing in';
          // Optionally redirect to verification page with email
          // router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }
        
        throw new Error(errorMessage);
      }

      if (result?.url) {
        try {
          // Check if the URL is absolute
          if (result.url.startsWith('http')) {
            const url = new URL(result.url);
            // Only allow redirects to the same origin
            if (url.origin === window.location.origin) {
              router.push(result.url);
            } else {
              router.push('/dashboard');
            }
          } else {
            // Handle relative URLs
            router.push(result.url);
          }
          return;
        } catch (e) {
          // If URL parsing fails, fall back to dashboard
          router.push('/dashboard');
          return;
        }
      }
      
      // If we get here, something unexpected happened
      throw new Error('An unknown error occurred');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during sign in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
