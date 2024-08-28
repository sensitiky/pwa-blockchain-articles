import React, { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FaCamera } from "react-icons/fa";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ModalUserDelete from "@/assets/userdelete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

interface User {
  firstName?: string;
  lastName?: string;
  date?: Date | null;
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
  const { isAuthenticated, user, setUser, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({});
  const [profileImage, setProfileImage] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(true);
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

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setUserInfo({ ...userInfo, date: date.toDate() });
    } else {
      setUserInfo({ ...userInfo, date: null });
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      handleProfileSave();
    }
    setEditMode(!editMode);
  };

  const handleBioEditToggle = async () => {
    if (bioEditMode) {
      const success = await handleBioSave();
      if (!success) {
        return; // No cambiar el modo de edición si la bio no es válida
      }
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

  const formatBio = (bioText: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Reemplaza URLs por enlaces azules
    let formattedText = bioText.replace(urlRegex, (url) => {
      return `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Reemplaza saltos de línea con <br> y aplica un estilo para añadir margen inferior
    formattedText = formattedText.replace(
      /\n/g,
      '<br style="margin-bottom: 1rem;">'
    );

    // Reemplaza tabulaciones con espacios en blanco
    formattedText = formattedText.replace(/\t/g, "&emsp;");

    return formattedText;
  };

  const handleBioSave = async (): Promise<boolean> => {
    const validBioPattern = /^[a-zA-Z0-9\s.,!?'"-]*$/;

    if (!validBioPattern.test(bio)) {
      alert(
        "Bio contains invalid characters. Please remove any links, images, or videos."
      );
      return false; // Indica que la operación falló
    }

    try {
      await api.put(`${API_URL}/users/me`, { ...userInfo, bio });
      setUserInfo({ ...userInfo, bio });
      fetchProfile();
      return true; // Indica que la operación fue exitosa
    } catch (error) {
      console.error("Error saving bio:", error);
      return false; // Indica que la operación falló
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > 1) {
      alert("The image file size should not exceed 1MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

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
        logout();
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-center mb-12">
        <Button
          variant="outline"
          className="w-fit bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg px-6 py-3"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Profile
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center md:flex-row md:space-x-20 px-4 md:px-6">
        <div className="flex-1 flex flex-col items-center md:items-start max-w-4xl">
          <div className="flex items-center gap-8 flex-col md:flex-row mb-10">
            <CardContainer className="inter-var mx-auto">
              <CardBody className="text-card-foreground rounded-xl w-full h-full transition-transform duration-300 ease-in-out relative flex justify-center items-center hover:shadow-xl">
                <CardItem translateZ="50" className="relative z-10">
                  <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-primary">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{user?.firstName}</AvatarFallback>
                  </Avatar>
                </CardItem>
              </CardBody>
            </CardContainer>
            <label
              htmlFor="profile-image-upload"
              className="cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
            >
              <FaCamera className="w-8 h-8 text-primary" />
              <input
                id="profile-image-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left text-[#000916]">
              Hi, {user?.firstName}
            </h1>
          </div>
          <div className="flex-1 w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Username
                </Label>
                {editMode ? (
                  <Input
                    name="user"
                    value={userInfo.user}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <span className="flex-grow text-xl text-[#000916]">
                      {user?.user}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  First Name
                </Label>
                {editMode ? (
                  <Input
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <span className="flex-grow text-xl text-[#000916]">
                      {user?.firstName}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Last Name
                </Label>
                {editMode ? (
                  <Input
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <span className="flex-grow text-xl text-[#000916]">
                      {user?.lastName}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Role
                </Label>
                {editMode ? (
                  <Input
                    name="role"
                    value={userInfo.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <span className="flex-grow text-xl text-[#000916]">
                      {user?.role}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Birthday
                </Label>
                {editMode ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={userInfo.date ? null : undefined}
                      label="Select your birthday"
                      onChange={handleDateChange}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                    />
                  </LocalizationProvider>
                ) : (
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <h2 className="text-xl text-[#000916]">
                      {user?.date
                        ? new Date(user.date).toDateString()
                        : "No date available"}
                    </h2>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Email
                </Label>
                <div className="flex items-center border-b-2 border-gray-300 py-2">
                  <span className="flex-grow text-xl text-[#000916]">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-2xl font-semibold text-gray-700">
                  Country
                </Label>
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
                  <div className="flex items-center border-b-2 border-gray-300 py-2">
                    <span className="flex-grow text-xl text-[#000916]">
                      {user?.country}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="hover:text-white w-full bg-[#000916] hover:bg-[#000916]/80 text-white font-semibold py-3 rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg mt-6"
                onClick={handleEditToggle}
              >
                {editMode ? "Save Changes" : "Edit Information"}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-[#000916]">Bio</h2>
                {bioEditMode ? (
                  <div>
                    <textarea
                      value={bio}
                      onChange={handleEditBio}
                      rows={10}
                      maxLength={360}
                      className="w-full p-3 border-2 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out"
                    />
                    <div className="text-right text-gray-500 mt-1">
                      {bio.length}/360
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-lg leading-relaxed"
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: formatBio(bio) }}
                  ></p>
                )}
              </div>

              <Button
                variant="outline"
                className="hover:text-white w-full bg-[#000916] hover:bg-[#000916]/80 text-white font-semibold py-3 rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={handleBioEditToggle}
              >
                {bioEditMode ? "Save Changes" : "Edit Bio"}
              </Button>
              <div className="flex items-center justify-center gap-6 mt-8">
                {user?.facebook && (
                  <Link
                    href={user?.facebook}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaFacebook className="w-8 h-8" />
                  </Link>
                )}
                {user?.instagram && (
                  <Link
                    href={user?.instagram}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaInstagram className="w-8 h-8" />
                  </Link>
                )}
                {user?.twitter && (
                  <Link
                    href={user?.twitter}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaTwitter className="w-8 h-8" />
                  </Link>
                )}
                {user?.linkedin && (
                  <Link
                    href={user?.linkedin}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaLinkedin className="w-8 h-8" />
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
