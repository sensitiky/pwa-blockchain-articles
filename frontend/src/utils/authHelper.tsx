import { AxiosError } from 'axios';

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  numberOrSymbol: boolean;
}

export const validatePassword = (password: string): PasswordCriteria => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  numberOrSymbol: /[0-9!@#$%^&*]/.test(password),
});

export const handleAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return (
        error.response.data.message || 'An error occurred with the response'
      );
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      return error.message || 'An error occurred setting up the request';
    }
  }
  return 'An unexpected error occurred';
};
