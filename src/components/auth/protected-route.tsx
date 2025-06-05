'use client';

import { ReactNode } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { PageLoading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useProtectedRoute(redirectTo);

  if (isLoading || !isAuthenticated) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
