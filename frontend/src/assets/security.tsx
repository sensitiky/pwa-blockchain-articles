"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Avatar,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { FaEdit, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface UserProfile {
  id?: number;
  firstName?: string;
  avatar?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: transparent;
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: #000916;
  margin-bottom: 1.5rem;
`;

const FieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FieldLabel = styled.div`
  font-size: 1rem;
  font-weight: medium;
  color: #000916;
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SecuritySettings: React.FC = () => {
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      const avatarUrl = user.avatar ? `${API_URL}${user.avatar}` : "";
      setUserInfo({
        id: user.id,
        firstName: user.firstName,
        avatar: avatarUrl,
        medium: user.medium,
        instagram: user.instagram,
        facebook: user.facebook,
        twitter: user.twitter,
        linkedin: user.linkedin,
        email: user.email,
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleSaveChanges = async (field: string) => {
    if (field === "password") {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
        return;
      }
      setPasswordError("");
    }

    const updatedField: Partial<UserProfile> & { id: number } = {
      id: userInfo.id ?? 0,
      [field]:
        field === "password" ? password : userInfo[field as keyof UserProfile],
    };

    try {
      await axios.put(`${API_URL}/users/me`, updatedField);
      setUser({ ...user, ...updatedField });
      setEditingField(null);
      if (field === "password") {
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fieldLabels: Record<keyof UserProfile, string | undefined> = {
    id: undefined,
    firstName: undefined,
    avatar: undefined,
    medium: "Medium",
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
  };

  if (loading) {
    return (
      <Container>
        <Image
          src="/Logo-blogchain.png"
          width={300}
          height={300}
          alt="Blogchain Logo"
          className="animate-bounce"
        />
      </Container>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            src={user?.avatar}
            alt={user?.firstName}
            sx={{ width: 56, height: 56 }}
          />
          <div>
            <h1 className="text-4xl font-bold text-[#000916]">
              Hi, {user?.user}
            </h1>
            <p className="text-xl text-gray-500">
              Manage your security settings.
            </p>
          </div>
        </div>
        <Section>
          <SectionTitle>Social Media</SectionTitle>
          {["medium", "instagram", "facebook", "twitter", "linkedin"].map(
            (field) => (
              <FieldContainer key={field}>
                <FieldLabel>
                  {fieldLabels[field as keyof UserProfile]}
                </FieldLabel>
                {editingField === field ? (
                  <TextField
                    name={field}
                    value={userInfo[field as keyof UserProfile] || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    onBlur={() => handleSaveChanges(field as keyof UserProfile)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Save">
                            <IconButton
                              onClick={() =>
                                handleSaveChanges(field as keyof UserProfile)
                              }
                            >
                              <FaCheck color="#28a745" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        userInfo[field as keyof UserProfile]
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {userInfo[field as keyof UserProfile]
                        ? "Provided"
                        : "Not Provided"}
                    </span>
                    <ActionIcons>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => setEditingField(field)}>
                          <FaEdit color="#007bff" />
                        </IconButton>
                      </Tooltip>
                    </ActionIcons>
                  </div>
                )}
              </FieldContainer>
            )
          )}
        </Section>
        <Section>
          <SectionTitle>Security</SectionTitle>
          <FieldContainer>
            <FieldLabel>Email</FieldLabel>
            {editingField === "email" ? (
              <TextField
                name="email"
                value={userInfo.email || ""}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                onBlur={() => handleSaveChanges("email")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Save">
                        <IconButton onClick={() => handleSaveChanges("email")}>
                          <FaCheck color="#28a745" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-500">{userInfo.email}</span>
                <ActionIcons>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEditingField("email")}>
                      <FaEdit color="#007bff" />
                    </IconButton>
                  </Tooltip>
                </ActionIcons>
              </div>
            )}
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Password</FieldLabel>
            {editingField === "password" ? (
              <div className="flex flex-col gap-2">
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  placeholder="New password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  placeholder="Confirm new password"
                />
                {passwordError && (
                  <span className="text-sm text-red-500">{passwordError}</span>
                )}
                <Button
                  className="rounded-full bg-[#000916] hover:bg-[#000916]/80"
                  onClick={() => handleSaveChanges("password")}
                >
                  Save Password
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-500">••••••••</span>
                <ActionIcons>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEditingField("password")}>
                      <FaEdit color="#007bff" />
                    </IconButton>
                  </Tooltip>
                </ActionIcons>
              </div>
            )}
          </FieldContainer>
        </Section>
      </Card>
    </motion.div>
  );
};

export default SecuritySettings;
