'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className={cn(
        'flex min-h-screen',
        'bg-gray-50 text-gray-900',
        'dark:bg-gray-900 dark:text-gray-100',
        inter.className
      )}>
        <DashboardNav items={navItems} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
          <Toaster />
        </main>
      </div>
    </ProtectedRoute>
  )
}
