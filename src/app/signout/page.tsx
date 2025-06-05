'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignOutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const { status } = useSession();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut({
          redirect: false,
          callbackUrl,
        });
        
        // Force a hard redirect to ensure all session data is cleared
        window.location.href = callbackUrl;
      } catch (error) {
        console.error('Error during sign out:', error);
        // If there's an error, still redirect to the home page
        window.location.href = '/';
      }
    };

    if (status !== 'loading') {
      performSignOut();
    }
  }, [status, callbackUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        <p className="text-lg font-medium text-gray-700">Signing out...</p>
      </div>
    </div>
  );
}
