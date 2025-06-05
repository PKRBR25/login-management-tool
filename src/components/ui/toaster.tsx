'use client';

import * as React from 'react';
import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast';
import { useToast } from './use-toast';
import { Toast, ToastViewport } from './toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <RadixToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <div className="font-medium">{title}</div>}
              {description && (
                <div className="text-sm opacity-90">{description}</div>
              )}
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </RadixToastProvider>
  );
}
