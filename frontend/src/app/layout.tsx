import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';
import { AuthProvider } from '../../context/authContext';
import FacebookInit from '@/assets/FacebookInit';
import Background from '@/assets/background';
import AuthWrapper from '@/assets/authwrapper';
import { Analytics } from '@vercel/analytics/react';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
}

export const metadata: Metadata = {
  title: 'Blogchain',
  description: 'Developer: Mario Correa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-gilroy font-medium">
        <GoogleOAuthProvider clientId={clientId as string}>
          <AuthProvider>
            <FacebookInit />
            <Analytics />
            <main className="w-full h-full overflow-x-hidden text-[#263238] bg-[#fefefe]">
              {children}
              <link rel="icon" href="/favicon.ico" sizes="any" />
            </main>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
