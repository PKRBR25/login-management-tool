import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If the user is authenticated, allow access to all routes
        // If not, they'll be redirected to the login page
        return token != null;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
