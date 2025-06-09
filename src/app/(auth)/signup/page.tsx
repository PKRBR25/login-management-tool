'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/lib/actions/auth.actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert, AlertDescription } from '@/components/ui';

interface FormState {
  message: string;
  errors: Record<string, string[]>;
  success?: boolean;
  userId?: number;
}

const initialState: FormState = {
  message: '',
  errors: {},
  success: false
};

function SubmitButtonWithPending({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <SubmitButton className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : children}
    </SubmitButton>
  );
}

export default function SignUpPage() {
  const [state, formAction] = React.useActionState<FormState, FormData>(
    signUp as (state: FormState, formData: FormData) => Promise<FormState>,
    initialState
  );
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-md bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={state.errors?.email?.[0]}
              />
            </div>

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={state.errors?.password?.[0]}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 12 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>

            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={state.errors?.confirmPassword?.[0]}
              />
            </div>

            {state.message && !state.success && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            {state.success && (
              <Alert>
                <AlertDescription>
                  {state.message} Check your email for the verification link.
                </AlertDescription>
              </Alert>
            )}
            <div>
              <SubmitButtonWithPending>
                Sign up
              </SubmitButtonWithPending>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
