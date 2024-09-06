import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { AuthProvider } from "../../context/authContext";
import FacebookInit from "@/assets/FacebookInit";
import Background from "@/assets/background";
import AuthWrapper from "@/assets/authwrapper";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
}

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
      <body className="font-gilroy font-medium">
        <AuthWrapper>
          <Background />
          <FacebookInit />
          <GoogleOAuthProvider clientId={clientId as string}>
            <AuthProvider>
              <main className="w-full h-full overflow-x-hidden font-regular text-[#263238]">
                {children}
              </main>
            </AuthProvider>
          </GoogleOAuthProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
