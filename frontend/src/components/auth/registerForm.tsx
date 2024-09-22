import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  validatePassword,
  PasswordCriteria,
  handleAxiosError,
} from "@/utils/authHelper";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

interface RegisterFormProps {
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
    verificationCode: string;
  }) => void;
  loading: boolean;
  error: string | null;
}

const StyledMessage = ({
  message,
  isError = false,
}: {
  message: string;
  isError?: boolean;
}) => {
  return (
    <div
      className={`text-center text-xl ${isError ? "text-red-500" : "text-[#ffdb15]"}`}
    >
      {message}
    </div>
  );
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    numberOrSymbol: false,
  });
  const [codeSent, setCodeSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    setPasswordCriteria(validatePassword(password));
  }, [password]);

  const checkUserExistence = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/check-user`,
        { user: username, email },
        { withCredentials: true },
      );

      if (response.data.exists) {
        if (response.data.field === "email") {
          throw new Error("An account with this email already exists.");
        } else if (response.data.field === "username") {
          throw new Error("This username is already taken.");
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    setMessage(null);
    try {
      // First, check if the username or email already exists
      await checkUserExistence();

      // If the user doesn't exist, proceed with sending the verification code
      const response = await axios.post(
        `${API_URL}/auth/send-verification-code`,
        { email },
        { withCredentials: true },
      );

      if (response.status === 200) {
        setCodeSent(true);
        setMessage({
          text: "Verification code sent to your email",
          isError: false,
        });
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (err) {
      setMessage({ text: handleAxiosError(err), isError: true });
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (codeSent) {
        onSubmit({ username, email, password, verificationCode });
      } else {
        await handleSendVerificationCode();
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setMessage({ text: handleAxiosError(err), isError: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={codeSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={codeSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
            disabled={codeSent}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="text-gray-500 hover:text-gray-700"
            />
          </button>
        </div>
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
      {codeSent && (
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the Terms and Conditions
        </Label>
      </div>
      {message && (
        <StyledMessage message={message.text} isError={message.isError} />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={
          loading ||
          sendingCode ||
          !termsAccepted ||
          (codeSent && !verificationCode) ||
          !passwordCriteria.length ||
          !passwordCriteria.uppercase ||
          !passwordCriteria.numberOrSymbol
        }
      >
        {loading || sendingCode
          ? "Processing..."
          : codeSent
            ? "Register"
            : "Send Verification Code"}
      </Button>
    </form>
  );
};
