import React, { useState, useEffect } from "react";
import { TextField, Button, Avatar, CircularProgress } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";

interface UserProfile {
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const FieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FieldLabel = styled.div`
  font-size: 1rem;
  font-weight: medium;
  text-transform: capitalize;
`;

const SecuritySettings: React.FC = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get("https://blogchain.onrender.com/users/me");
        const profile = response.data;
        const avatarUrl = profile.avatar
          ? `https://blogchain.onrender.com${profile.avatar}`
          : "";
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

  const handleSaveChanges = async () => {
    try {
      await api.put("https://blogchain.onrender.com/users/me", userInfo);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
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
            <h1 className="text-4xl font-bold">Hi, {user?.firstName}</h1>
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
                {editMode ? (
                  <TextField
                    name={field}
                    value={userInfo[field as keyof UserProfile] || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
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
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setEditMode(true)}
                    >
                      <FaEdit />
                    </Button>
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
              {editMode ? (
                <TextField
                  name={field}
                  type={field.includes("password") ? "password" : "text"}
                  value={userInfo[field as keyof UserProfile] || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
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
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              )}
            </FieldContainer>
          ))}
        </Section>
        {editMode && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            className="mt-6"
          >
            Save Changes
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default SecuritySettings;
