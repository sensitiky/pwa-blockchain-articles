"use client";
import { JSX, SVGProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";

export default function LoginCard() {
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        usuario,
        contrasena,
      });

      console.log("Login response:", response);

      if (response.status === 200) {
        console.log("Login successful", response.data);
        router.push("/newarticles");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error:", err.response);
        setError(err.response?.data.message || "Login failed");
      } else {
        console.log("General error:", err);
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        usuario,
        contrasena,
        email,
        code: verificationCode,
      });

      console.log("Register response:", response);

      if (response.status === 200) {
        console.log("Registration successful", response.data);
        router.push("/users");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error:", err.response);
        setError(err.response?.data.message || "Registration failed");
      } else {
        console.log("General error:", err);
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/send-verification-code",
        { email }
      );

      console.log("Send verification code response:", response);

      if (response.status === 200) {
        console.log("Verification code sent", response.data);
        setError("Verification code sent to your email");
      } else {
        setError("Failed to send verification code");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error:", err.response);
        setError(
          err.response?.data.message || "Failed to send verification code"
        );
      } else {
        console.log("General error:", err);
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/forgot-password",
        { email }
      );

      console.log("Forgot password response:", response);

      if (response.status === 200) {
        console.log("Forgot password request successful");
        setError("Password reset code sent to your email");
      } else {
        setError("Failed to send password reset code");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error:", err.response);
        setError(
          err.response?.data.message || "Failed to send password reset code"
        );
      } else {
        console.log("General error:", err);
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/reset-password",
        {
          email,
          code: resetCode,
          newPassword,
        }
      );

      console.log("Reset password response:", response);

      if (response.status === 200) {
        console.log("Password reset successful", response.data);
        setError(
          "Password reset successful, please login with your new password"
        );
        setForgotPassword(false);
      } else {
        setError("Failed to reset password");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error:", err.response);
        setError(err.response?.data.message || "Failed to reset password");
      } else {
        console.log("General error:", err);
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await axios.post("http://localhost:4000/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Google login response:", response);

      if (response.status === 200) {
        console.log("Google login successful", response.data);
        router.push("/newarticles");
      } else {
        setError("Google login failed");
      }
    } catch (err) {
      console.log("Google login error:", err);
      setError("Google login failed");
    }
  };

  const handleGoogleRegisterSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await axios.post("http://localhost:4000/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Google register response:", response);

      if (response.status === 200) {
        console.log("Google registration successful", response.data);
        router.push("/users");
      } else {
        setError("Google registration failed");
      }
    } catch (err) {
      console.log("Google registration error:", err);
      setError("Google registration failed");
    }
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setError(null);
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div className="mx-auto max-w-md space-y-6">
        {!showRegister && !forgotPassword && (
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your username and password to access your account.
            </p>
          </div>
        )}
        {showRegister && !forgotPassword && (
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-muted-foreground">
              Enter your details to create an account.
            </p>
          </div>
        )}
        {!showRegister && forgotPassword && (
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a password reset code.
            </p>
          </div>
        )}
        {!showRegister && !forgotPassword && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-center">
              <Button
                type="button"
                className="rounded-sm w-44 bg-customColor-header"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setError("Google login failed")}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              <div>
                Don't have an account?{" "}
                <button
                  onClick={() => setShowRegister(true)}
                  className="underline"
                >
                  Create one
                </button>
              </div>
            </div>
          </div>
        )}

        {showRegister && !forgotPassword && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <div className="flex justify-center">
                <Button
                  type="button"
                  className="mt-2 rounded-sm w-44 bg-customColor-header"
                  onClick={handleSendVerificationCode}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-center">
              <Button
                type="button"
                className="rounded-sm w-44"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleRegisterSuccess}
                onError={() => setError("Google registration failed")}
              />
            </div>
            <div className="space-y-2 flex items-center">
              <Checkbox id="terms" className="mr-4" required />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                I confirmed that I have read and agree to the{" "}
                <Link href="#" className="underline" prefetch={false}>
                  Terms and Conditions
                </Link>
                ,{" "}
                <Link href="#" className="underline" prefetch={false}>
                  Services Terms
                </Link>
                ,{" "}
                <Link href="#" className="underline" prefetch={false}>
                  Earn Terms
                </Link>
                ,{" "}
                <Link href="#" className="underline" prefetch={false}>
                  Exchange Terms
                </Link>
                , and{" "}
                <Link href="#" className="underline" prefetch={false}>
                  Privacy Policy
                </Link>{" "}
                of Blogchain.
              </Label>
            </div>
            <div className="mt-4 text-center text-sm">
              <div>
                Already have an account?{" "}
                <button
                  onClick={() => setShowRegister(false)}
                  className="underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}

        {!showRegister && forgotPassword && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex justify-center">
                <Button
                  type="button"
                  className="mt-2 rounded-sm w-44 bg-customColor-header"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-code">Reset Code</Label>
              <Input
                id="reset-code"
                type="text"
                placeholder="Enter reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-center">
              <Button
                type="button"
                className="w-full rounded-full"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        )}
        {!showRegister && !forgotPassword && (
          <div className="text-center">
            <Link
              href="#"
              passHref
              onClick={toggleForgotPassword}
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
