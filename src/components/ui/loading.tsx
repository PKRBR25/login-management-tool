import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingProps = {
  className?: string;
  size?: number;
};

export function Loading({ className, size = 24 }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-gray-500" size={size} />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading size={48} />
    </div>
  );
}
