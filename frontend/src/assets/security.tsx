"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { FaEdit, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

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
  background-color: #f7f8fa;
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
  const { isAuthenticated, user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchProfile = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get(`${API_URL}/users/me`);
        const profile = response.data;
        const avatarUrl = profile.avatar ? `${API_URL}${profile.avatar}` : "";
        setUser({
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          date: profile.date ? new Date(profile.date) : undefined,
          email: profile.email,
          user: profile.user,
          country: profile.country,
          medium: profile.medium,
          instagram: profile.instagram,
          facebook: profile.facebook,
          twitter: profile.twitter,
          linkedin: profile.linkedin,
          bio: profile.bio,
          avatar: avatarUrl,
          postCount: profile.postCount || 0,
        });
        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSaveChanges = async (field: keyof UserProfile) => {
    if (field === "password" || field === "confirmPassword") {
      if (userInfo.password !== userInfo.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    const updatedField: Partial<UserProfile> & { id: number } = {
      id: userInfo.id ?? 0,
      [field]: userInfo[field],
    };

    try {
      await api.put(`${API_URL}/users/me`, updatedField);
      setUser({ ...user, ...updatedField });
      setEditingField(null);
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center h-screen"
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
              Hi, {user?.firstName}
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
                <FieldLabel>{field}</FieldLabel>
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
          {["email", "password", "confirmPassword"].map((field) => (
            <FieldContainer key={field}>
              <FieldLabel>{field}</FieldLabel>
              {editingField === field ? (
                <TextField
                  name={field}
                  type={
                    field.includes("password") && !showPassword
                      ? "password"
                      : "text"
                  }
                  value={userInfo[field as keyof UserProfile] || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  onBlur={() => handleSaveChanges(field as keyof UserProfile)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {field.includes("password") ? (
                          <>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                            <Tooltip title="Save">
                              <IconButton
                                onClick={() =>
                                  handleSaveChanges(field as keyof UserProfile)
                                }
                              >
                                <FaCheck color="#28a745" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Save">
                            <IconButton
                              onClick={() =>
                                handleSaveChanges(field as keyof UserProfile)
                              }
                            >
                              <FaCheck color="#28a745" />
                            </IconButton>
                          </Tooltip>
                        )}
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
          ))}
        </Section>
      </Card>
    </motion.div>
  );
};

export default SecuritySettings;
