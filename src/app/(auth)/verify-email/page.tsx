'use client';

import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/lib/actions/auth.actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to {email || 'your email'}. Please enter it below.
          </p>
        </div>

        <form action={verifyEmail} className="mt-8 space-y-6">
          <div className="rounded-md bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 space-y-6">
            <input type="hidden" name="email" value={email || ''} />
            
            <div>
              <Input
                id="verification_token"
                name="verification_token"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                label="Verification Code"
                placeholder="123456"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            <div>
              <SubmitButton className="w-full">
                Verify Email
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
