import React, { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FaCamera, FaShareAlt } from "react-icons/fa";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ModalUserDelete from "@/assets/userdelete";

const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

interface User {
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

const ProfileSettings: React.FC = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({});
  const [profileImage, setProfileImage] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const router = useRouter();

  const fetchProfile = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get(`${API_URL}/users/me`);
        const profile = response.data;
        const avatarUrl = profile.avatar ? `${API_URL}${profile.avatar}` : "";
        const userData = {
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
          postCount: profile.postCount,
          role: profile.role,
        };
        setUser(userData);
        setUserInfo(userData);
        setProfileImage(
          avatarUrl ? `${avatarUrl}?${new Date().getTime()}` : ""
        );
        setBio(profile.bio || "");
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

  const handleCountryChange = (
    selectedOption: SingleValue<{ label: string; value: string }>
  ) => {
    setUserInfo({ ...userInfo, country: selectedOption?.value || "" });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setUserInfo({ ...userInfo, date });
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      handleProfileSave();
    }
    setEditMode(!editMode);
  };

  const handleBioEditToggle = () => {
    if (bioEditMode) {
      handleBioSave();
    }
    setBioEditMode(!bioEditMode);
  };

  const handleEditBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleProfileSave = async () => {
    try {
      await api.put(`${API_URL}/users/me`, userInfo);
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  const handleBioSave = async () => {
    try {
      await api.put(`${API_URL}/users/me`, { ...userInfo, bio });
      setUserInfo({ ...userInfo, bio });
      fetchProfile();
    } catch (error) {
      console.error("Error saving bio:", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      const response = await uploadAvatar(formData);
      const avatarUrl = formatAvatarUrl(response.data.avatar);
      updateProfileImage(avatarUrl);
      await refreshUserProfile();
    } catch (error) {
      handleAvatarUploadError(error);
    }
  };

  const uploadAvatar = async (formData: FormData) => {
    return await api.put(`${API_URL}/users/me`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const formatAvatarUrl = (avatarPath: string): string => {
    const baseUrl = `${API_URL}`;
    return `${baseUrl}${avatarPath}`;
  };

  const updateProfileImage = (avatarUrl: string) => {
    const cacheBuster = `?${new Date().getTime()}`;
    setProfileImage(`${avatarUrl}${cacheBuster}`);
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, avatar: avatarUrl }));
  };

  const refreshUserProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  useEffect(() => {
    if (role) {
      localStorage.setItem("userRole", role);
    }
  }, [role]);

  const handleAvatarUploadError = (error: any) => {
    console.error("Error uploading avatar:", error);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_URL}${user.avatar}`
    : "default-avatar-url";

  const handleDeleteProfile = async () => {
    if (deleteConfirmation === "Delete") {
      try {
        await api.delete(`${API_URL}/users/me`);
        router.push("/");
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Profile
      </Button>
      <div className="flex flex-col items-center justify-center md:flex-row md:space-x-8 px-4 md:px-6">
        <div className="flex-1 flex flex-col items-center md:items-center">
          <div className="flex items-center gap-6 flex-col md:flex-row">
            <CardContainer className="inter-var mx-auto">
              <CardBody className="bg-inherit text-card-foreground border-none rounded-lg shadow-none w-full h-full transition-transform relative flex justify-center items-center">
                <CardItem translateZ="50" className="relative z-10">
                  <Avatar className="w-36 h-36 md:w-36 md:h-36">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{user?.firstName}</AvatarFallback>
                  </Avatar>
                </CardItem>
              </CardBody>
            </CardContainer>
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              <FaCamera className="w-6 h-6 text-primary" />
              <input
                id="profile-image-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <h1 className="text-5xl md:text-5xl font-bold text-center md:text-left">
              Hi, {user?.firstName}
            </h1>
          </div>
          <div className="flex-1 w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label className="text-2xl">Username</Label>
                {editMode ? (
                  <Input
                    name="user"
                    value={userInfo.user}
                    onChange={handleInputChange}
                    className="focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <span className="flex-grow">{user?.user}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">First Name</Label>
                {editMode ? (
                  <Input
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    className="focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <span className="flex-grow">{user?.firstName}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">Last Name</Label>
                {editMode ? (
                  <Input
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    className="focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <span className="flex-grow">{user?.lastName}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">Rol</Label>
                {editMode ? (
                  <Input
                    name="role"
                    value={userInfo.role}
                    onChange={handleInputChange}
                    className="focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <span className="flex-grow">{user?.role}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">Date</Label>
                {editMode ? (
                  <DatePicker
                    selected={userInfo.date}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-full p-2 border rounded focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <h2>
                      {user?.date
                        ? new Date(user.date).toDateString()
                        : "No date available"}
                    </h2>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">Email</Label>
                <div className="flex items-center border-b-[1px]">
                  <span className="flex-grow">{user?.email}</span>
                </div>
              </div>
              <div className="grid gap-1">
                <Label className="text-2xl">Country</Label>
                {editMode ? (
                  <Select
                    options={countryList().getData()}
                    value={{
                      label: userInfo.country || "",
                      value: userInfo.country || "",
                    }}
                    onChange={(
                      newValue: SingleValue<{ label: string; value: string }>
                    ) => handleCountryChange(newValue)}
                    className="w-full text-xl"
                  />
                ) : (
                  <div className="flex items-center border-b-[1px]">
                    <span className="flex-grow">{user?.country}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
                onClick={handleEditToggle}
              >
                {editMode ? "Save Changes" : "Edit Information"}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Bio</h2>
                {bioEditMode ? (
                  <textarea
                    value={bio}
                    onChange={handleEditBio}
                    rows={10}
                    className="w-full p-2 border rounded resize-none focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-500">{bio}</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
                onClick={handleBioEditToggle}
              >
                {bioEditMode ? "Save Changes" : "Edit Bio"}
              </Button>
              <div className="flex items-center justify-center gap-4">
                {user?.facebook && (
                  <Link
                    href={user?.facebook}
                    className="text-primary"
                    prefetch={false}
                  >
                    <FaFacebook className="w-6 h-6" />
                  </Link>
                )}
                {user?.instagram && (
                  <Link
                    href={user?.instagram}
                    className="text-primary"
                    prefetch={false}
                  >
                    <FaInstagram className="w-6 h-6" />
                  </Link>
                )}
                {user?.twitter && (
                  <Link
                    href={user?.twitter}
                    className="text-primary"
                    prefetch={false}
                  >
                    <FaTwitter className="w-6 h-6" />
                  </Link>
                )}
                {user?.linkedin && (
                  <Link
                    href={user?.linkedin}
                    className="text-primary"
                    prefetch={false}
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalUserDelete
          show={showDeleteModal}
          deleteConfirmation={deleteConfirmation}
          setDeleteConfirmation={setDeleteConfirmation}
          handleDeleteProfile={handleDeleteProfile}
          handleClose={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
