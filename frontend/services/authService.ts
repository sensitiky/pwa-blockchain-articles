interface UserInfo {
  firstName: string;
  lastName: string;
  date: Date;
  email: string;
  user: string;
  country: string;
  medium: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  bio: string;
}

import axios from "axios";
import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("http://149.50.141.173:4000/auth/login", { email, password });
  const { token } = response.data;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

export const getProfile = async () => {
  try {
    const response = await api.get("http://149.50.141.173:4000/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data", error);
    throw error;
  }
};

export const updateProfile = async (userInfo: UserInfo) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://149.50.141.173:4000/users/me",
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export default api;
