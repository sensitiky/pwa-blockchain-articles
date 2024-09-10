"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { UserInfo, User } from "@/interfaces/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (data: any) => void;
  loginWithGoogle: (token: string) => void;
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

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data", error);
    throw error;
  }
};

export const updateProfile = async (userInfo: UserInfo) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.put(`${API_URL}/users/me`, userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((userData: any) => {
    localStorage.setItem("token", userData.token);
    setToken(userData.token);
    setUser(userData.user);
  }, []);

  const loginWithGoogle = useCallback(async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { token });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error("Google login failed");
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setToken(token);
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
    () => ({
      user,
      token,
      setUser,
      isAuthenticated,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, token, isAuthenticated, login, loginWithGoogle, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
