"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useAuth } from "../../context/authContext";
import { handleAxiosError } from "@/utils/authHelper";
import { LoginForm } from "@/components/auth/loginForm";
import { RegisterForm } from "@/components/auth/registerForm";
import { ForgotPasswordForm } from "@/components/auth/forgotPasswordForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

interface LoginCardProps {
  onClose: () => void;
}

const StyledMessage = ({ message }: { message: string }) => {
  return <div className="text-center text-xl text-[#ffdb15]">{message}</div>;
};

export default function LoginCard({ onClose }: LoginCardProps) {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgot" | "verify" | "reset"
  >("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setUser: setAuthUser, login } = useAuth();

  const handleSubmit = useCallback(
    async (formData: Record<string, string>) => {
      setLoading(true);
      setMessage(null);

      try {
        let response;
        switch (formType) {
          case "login":
            response = await axios.post(`${API_URL}/auth/login`, formData, {
              withCredentials: true,
            });
            break;
          case "register":
            response = await axios.post(`${API_URL}/auth/register`, formData, {
              withCredentials: true,
            });
            break;
          case "forgot":
            response = await axios.post(
              `${API_URL}/auth/forgot-password`,
              formData,
              { withCredentials: true }
            );
            break;
          case "verify":
            response = await axios.post(
              `${API_URL}/auth/verify-code`,
              formData,
              {
                withCredentials: true,
              }
            );
            break;
          case "reset":
            response = await axios.post(
              `${API_URL}/auth/reset-password`,
              formData,
              {
                withCredentials: true,
              }
            );
            break;
        }

        if (response && response.status === 200) {
          if (formType === "login" || formType === "register") {
            setAuthUser(response.data.user);
            login(response.data);
            router.push("/users");
            onClose();
          } else if (formType === "forgot") {
            setMessage("Password reset email sent");
            setFormType("verify");
          } else if (formType === "verify") {
            setMessage("Code verified, you can now reset your password");
            setFormType("reset");
          } else if (formType === "reset") {
            setMessage("Password reset successful, you can now log in");
            setFormType("login");
          }
        }
      } catch (err) {
        setMessage(handleAxiosError(err));
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    },
    [formType, setAuthUser, login, router, onClose]
  );

  const handleGoogleLoginSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      try {
        const token = credentialResponse.credential;
        if (!token) {
          throw new Error("No token provided");
        }

        const response = await axios.post(
          `${API_URL}/auth/google`,
          { token },
          { withCredentials: true }
        );

        if (response.status === 200) {
          const { user, token } = response.data;
          setAuthUser(user);
          login(response.data);
          localStorage.setItem("token", token);
          router.push("/users");
          onClose();
        }
      } catch (err) {
        Error("Google login failed");
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    },
    [setAuthUser, login, router, onClose]
  );

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div className="mx-auto max-w-sm space-y-6 z-50 ">
        <h1 className="text-3xl font-bold text-center">
          {formType === "login"
            ? "Login"
            : formType === "register"
            ? "Register"
            : formType === "forgot"
            ? "Reset Password"
            : formType === "verify"
            ? "Verify Code"
            : "Reset Password"}
        </h1>
        <p className="text-muted-foreground text-center">
          {formType === "login"
            ? "Enter your email and password to access your account."
            : formType === "register"
            ? "Enter your details to create an account."
            : formType === "forgot"
            ? "Enter your email to receive a password reset code."
            : formType === "verify"
            ? "Enter the verification code sent to your email."
            : "Enter your new password."}
        </p>

        {message && <StyledMessage message={message} />}

        {formType === "login" && (
          <LoginForm onSubmit={handleSubmit} loading={loading} error={null} />
        )}
        {formType === "register" && (
          <RegisterForm
            onSubmit={handleSubmit}
            loading={loading}
            error={null}
          />
        )}
        {(formType === "forgot" ||
          formType === "verify" ||
          formType === "reset") && (
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            error={null}
            formType={formType}
          />
        )}

        {formType === "login" && (
          <>
            <div className="space-y-2 flex flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  Error("Google login failed");
                  setTimeout(() => {
                    setMessage(null);
                  }, 2000);
                }}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              <div>
                Don't have an account?{" "}
                <button
                  onClick={() => setFormType("register")}
                  className="underline"
                >
                  Create one
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setFormType("forgot")}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </>
        )}

        {formType !== "login" && (
          <div className="mt-4 text-center text-sm">
            <button onClick={() => setFormType("login")} className="underline">
              Back to Login
            </button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
