import Link from 'next/link';
import { signUp } from '@/lib/actions/auth.actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';

export default function SignUpPage() {
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

        <form action={signUp} className="mt-8 space-y-6">
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
              />
            </div>

            <div>
              <SubmitButton className="w-full">
                Sign up
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
