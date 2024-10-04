import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';
import { AuthProvider } from '../../context/authContext';
import FacebookInit from '@/assets/FacebookInit';
import AuthWrapper from '@/assets/authwrapper';
import { Analytics } from '@vercel/analytics/react';
import MixPanel from '@/components/layout/mixpanel';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
}

export const metadata: Metadata = {
  title: 'Blogchain',
  description:
    'Blogchain is an educational space to connect web content and readers interested in blockchain technology and its adoption.',
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
          <AuthWrapper>
            <AuthProvider>
              <FacebookInit />
              <Analytics />
              <MixPanel />
              <main className="w-full h-full overflow-x-hidden text-[#263238] bg-[#fefefe]">
                {children}
                <link rel="icon" href="/favicon.ico" sizes="any" />
              </main>
            </AuthProvider>
          </AuthWrapper>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
