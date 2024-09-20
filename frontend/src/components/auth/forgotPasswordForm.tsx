import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface ForgotPasswordFormProps {
  onSubmit: (formData: {
    email: string;
    code?: string;
    newPassword?: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  formType: 'forgot' | 'verify' | 'reset';
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading,
  error,
  formType,
}) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'forgot') {
      await onSubmit({ email });
    } else if (formType === 'verify') {
      await onSubmit({ email, code });
    } else if (formType === 'reset') {
      await onSubmit({ email, code, newPassword });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {formType !== 'forgot' && (
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
      )}
      {formType === 'reset' && (
        <div className="space-y-2 relative">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type={passwordVisible ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 top-6 flex items-center"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="text-gray-500 hover:text-gray-700"
            />
          </button>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full rounded-full" disabled={loading}>
        {loading
          ? 'Processing...'
          : formType === 'forgot'
          ? 'Send Reset Link'
          : formType === 'verify'
          ? 'Verify Code'
          : 'Reset Password'}
      </Button>
    </form>
  );
};
