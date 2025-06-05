'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useAuth({
  required = true,
  redirectTo = '/login',
  redirectIfFound = false,
}: UseAuthOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required and user is not authenticated, redirect to login
    if (required && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If redirectIfFound is true and user is authenticated, redirect to the specified page
    if (redirectIfFound && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, required, redirectTo, redirectIfFound, router]);

  return {
    isLoading,
    isAuthenticated,
    user: session?.user,
    session,
  };
}
