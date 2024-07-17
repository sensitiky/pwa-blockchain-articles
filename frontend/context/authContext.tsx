"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  user: any;
  setUser: (user: any) => void;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('https://blogchain.onrender.com/users/me');
        setUser(response.data);
      } catch (error) {
        console.log('User not logged in');
      }
    };
    checkUser();
  }, []);

  const login = async (credentials: any) => {
    const response = await axios.post('https://blogchain.onrender.com/users/login', credentials);
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await axios.post('https://blogchain.onrender.com/api/users/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
