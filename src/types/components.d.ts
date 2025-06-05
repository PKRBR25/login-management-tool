import * as React from 'react';

// Button component
declare module '@/components/ui/button' {
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }

  const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  
  export { Button };
}

// DashboardNav component
declare module '@/components/dashboard/dashboard-nav' {
  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
    items: NavItem[];
    className?: string;
  }

  const DashboardNav: React.FC<DashboardNavProps>;
  export { DashboardNav };
}

// ProtectedRoute component
declare module '@/components/auth/protected-route' {
  interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps>;
  export { ProtectedRoute };
}

// Toaster component
declare module '@/components/ui/toaster' {
  interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastOptions?: any;
  }

  const Toaster: React.FC<ToasterProps>;
  
  interface Toast {
    success: (message: string, options?: any) => string | number;
    error: (message: string, options?: any) => string | number;
    info: (message: string, options?: any) => string | number;
    warning: (message: string, options?: any) => string | number;
    dismiss: (toastId?: string | number) => void;
  }
  
  const toast: Toast;
  export { Toaster, toast };
}

// Loading components
declare module '@/components/ui/loading' {
  interface LoadingProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  const Loading: React.FC<LoadingProps>;
  const PageLoading: React.FC<LoadingProps>;
  
  export { Loading, PageLoading };
}
