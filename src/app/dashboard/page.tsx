'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { LayoutDashboard, Settings, Users, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

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

export default function DashboardPage() {
  const { user, isLoading } = useAuth({ required: true });
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">Dashboard</h1>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{user?.email}</span>
            </div>
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="hidden w-64 border-r border-gray-200 bg-white p-4 lg:block">
            <DashboardNav items={navItems} className="mt-4" />
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.location.href = '/signout'}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}
          </h2>
                <p className="mt-1 text-sm text-gray-500">
                  You're now signed in to your account.
                </p>

                <div className="mt-8">
                  <h3 className="text-md font-medium text-gray-900">Quick Actions</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Add quick action buttons here */}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
