import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AuthProvider, useAuth } from "../../context/authContext";
import useFacebookSDK from "@/hooks/MetaSDK";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginCard({ onClose }: { onClose: () => void }) {
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    numberOrSymbol: false,
  });
  const router = useRouter();
  const { setUser, login } = useAuth();

  useFacebookSDK();

  const validatePassword = (password: string) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    numberOrSymbol: /[0-9!@#$%^&*]/.test(password),
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);

    const criteria = validatePassword(password);
    setPasswordCriteria(criteria);

    if (!criteria.length || !criteria.uppercase || !criteria.numberOrSymbol) {
      setPasswordError("Password does not meet the criteria.");
    } else {
      setPasswordError(null);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://blogchain.onrender.com/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        login(response.data);
        router.push("/");
        onClose();
      } else {
        setError("Login failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Login failed");
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.numberOrSymbol
    ) {
      setError("Password does not meet the criteria.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://blogchain.onrender.com/auth/register",
        { usuario, password, email, code: verificationCode },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        login(response.data);
        router.push("/users");
        onClose();
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Registration failed");
      } else {
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
        "https://blogchain.onrender.com/auth/send-verification-code",
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCodeSent(true);
        setError("Verification code sent to your email");
      } else {
        setError("Failed to send verification code");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.message || "Failed to send verification code"
        );
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://blogchain.onrender.com/auth/verify-code",
        { email, code: verificationCode },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCodeVerified(true);
        setError(null);
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Invalid verification code");
      } else {
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
        "https://blogchain.onrender.com/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCodeSent(true);
        setError("Password reset code sent to your email");
      } else {
        setError("Failed to send password reset code");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.message || "Failed to send password reset code"
        );
      } else {
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
        "https://blogchain.onrender.com/auth/reset-password",
        { email, code: resetCode, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setError(
          "Password reset successful, please login with your new password"
        );
        setForgotPassword(false);
      } else {
        setError("Failed to reset password");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Failed to reset password");
      } else {
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
      const response = await axios.post(
        "https://blogchain.onrender.com/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        login(response.data);
        onClose();
      } else {
        setError("Google login failed");
      }
    } catch (err) {
      setError("Google login failed");
    }
  };

  const handleFacebookLogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          handleFacebookResponse(response.authResponse.accessToken);
        } else {
          setError("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleFacebookResponse = async (accessToken: string) => {
    try {
      const res = await axios.post(
        "https://blogchain.onrender.com/auth/facebook",
        { accessToken },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser(res.data.user);
        login(res.data);
        onClose();
      } else {
        setError("Facebook login failed");
      }
    } catch (err) {
      setError("Facebook login failed");
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
      <AuthProvider>
        <div className="mx-auto max-w-md space-y-6">
          {!showRegister && !forgotPassword && (
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-muted-foreground">
                Enter your email and password to access your account.
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
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
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-center">
                <Button
                  type="button"
                  className="rounded-full w-44 bg-customColor-header"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="flex justify-center">
                <Button
                  className="rounded-full w-44 bg-customColor-header"
                  onClick={handleFacebookLogin}
                >
                  Login with Facebook
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
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <p>Password must contain:</p>
                <ul>
                  <li
                    className={
                      passwordCriteria.length
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    💪🏽 At least 8 characters
                  </li>
                  <li
                    className={
                      passwordCriteria.uppercase
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    🤳🏽 Lowercase or uppercase letter
                  </li>
                  <li
                    className={
                      passwordCriteria.numberOrSymbol
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    👨🏽‍💻 Number or symbol
                  </li>
                </ul>
              </div>
              {!passwordCriteria.length ||
              !passwordCriteria.uppercase ||
              !passwordCriteria.numberOrSymbol ? (
                <div className="text-red-500">
                  Please complete all the password criteria.
                </div>
              ) : null}
              {codeSent && !codeVerified && (
                <>
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
                        onClick={handleVerifyCode}
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify Code"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {!codeSent && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    className="mt-2 rounded-full w-44 bg-customColor-header"
                    onClick={handleSendVerificationCode}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </div>
              )}
              {codeVerified && (
                <>
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
                </>
              )}
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  className="rounded-full w-44 bg-customColor-header"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </Button>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              {codeSent && (
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground">
                    Enter the code sent to your email and your new password.
                  </p>
                  <Input
                    id="reset-code"
                    type="text"
                    placeholder="Enter reset code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      className="rounded-full w-44 bg-customColor-header"
                      onClick={handleResetPassword}
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4 text-center text-sm">
                <button
                  onClick={() => setForgotPassword(false)}
                  className="underline"
                >
                  Back to Login
                </button>
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
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
