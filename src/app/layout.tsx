import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { SessionProvider } from '@/components/providers/session-provider';
import { authOptions } from '@/lib/auth-options';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login Management Tool',
  description: 'User authentication and management system',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <SessionProvider session={session}>
          <div className="min-h-full">
            {children}
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
