"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import api from "../services/api";

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  date?: Date;
  email?: string;
  user?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
  role?: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: any) => {
    localStorage.setItem("token", userData.token);
    setUser(userData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get(`${API_URL}/users/me`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        logout();
      }
    };
    fetchUser();
  }, [logout]);

  const isAuthenticated = !!user;

  const contextValue = useMemo(
    () => ({ user, setUser, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
