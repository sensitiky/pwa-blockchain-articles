import React, { useState, useEffect } from "react";
import { TextField, Button, Avatar, CircularProgress } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { Separator } from "@radix-ui/react-dropdown-menu";

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

const SecuritySettings: React.FC = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get("http://localhost:4000/users/me");
        const profile = response.data;
        const avatarUrl = profile.avatar
          ? `http://localhost:4000${profile.avatar}`
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
      await api.put("http://localhost:4000/users/me", userInfo);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  const handleSaveChangesPassWord = async () => {
    try {
      await api.put("http://localhost:4000/users/me", userInfo);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto p-6 h-[700px] w-4xl bg-inherit shadow-none rounded-lg ">
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
        <div className="grid grid-cols-2 gap-6">
          <div className="border-r-2">
            <h2 className="text-2xl font-bold mb-4">Social Media</h2>
            {["medium", "instagram", "facebook", "twitter", "linkedin"].map(
              (field) => (
                <div
                  key={field}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="text-lg font-medium capitalize">{field}</div>
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
                </div>
              )
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Security</h2>
            {["email", "password", "confirmPassword"].map((field) => (
              <div
                key={field}
                className="flex items-center justify-between mb-4"
              >
                <div className="text-lg font-medium capitalize">{field}</div>
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
              </div>
            ))}
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default SecuritySettings;
