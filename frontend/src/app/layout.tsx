import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { AuthProvider } from "../../context/authContext";
import dynamic from "next/dynamic";
import FacebookInit from "@/assets/FacebookInit";
import Background from "@/assets/background";
import AuthWrapper from "@/assets/authwrapper";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
}
const CustomEditor = dynamic(() => import("@/components/ui/editor"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Blogchain",
  description: "Developer: Mario Correa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-gilroy">
        <AuthWrapper>
          <Background />
          <FacebookInit />
          <GoogleOAuthProvider clientId={clientId as string}>
            <AuthProvider>
              <main className="w-full h-full overflow-x-hidden font-regular">
                {children}
              </main>
            </AuthProvider>
          </GoogleOAuthProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
