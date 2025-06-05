'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  className?: string;
}

export function DashboardNav({ items, className, ...props }: DashboardNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900',
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600',
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
