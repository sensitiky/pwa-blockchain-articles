"use client";
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
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "../../context/authContext";
import { Skeleton } from "@/components/ui/skeleton";
import api from "../../services/api";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { ComputerIcon } from "lucide-react";

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
}

const ProfileSettings: React.FC = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({});
  const [profileImage, setProfileImage] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

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
          postCount: profile.postCount,
        });
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
      await api.put("http://localhost:4000/users/me", userInfo);
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  const handleBioSave = async () => {
    try {
      await api.put("http://localhost:4000/users/me", { ...userInfo, bio });
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
    return await api.put("http://localhost:4000/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const formatAvatarUrl = (avatarPath: string): string => {
    const baseUrl = "http://localhost:4000";
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

  const handleAvatarUploadError = (error: any) => {
    console.error("Error uploading avatar:", error);
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center justify-center md:flex-row md:space-x-8 px-4 md:px-6">
      <div className="flex-1 flex flex-col items-center md:items-start">
        <div className="flex items-center gap-6 flex-col md:flex-row">
          <CardContainer className="inter-var mx-auto">
            <CardBody className="bg-inherit text-card-foreground border-none rounded-lg shadow-none w-full h-full transition-transform relative flex justify-center items-center">
              <CardItem translateZ="50" className="relative z-10">
                <Avatar className="w-36 h-36 md:w-36 md:h-36">
                  <AvatarImage src={user?.avatar} />
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
                  value={userInfo.user || ""}
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
                  value={userInfo.firstName || ""}
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
                  value={userInfo.lastName || ""}
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
              <Label className="text-2xl">Date</Label>
              {editMode ? (
                <DatePicker
                  selected={user?.date}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border rounded focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center border-b-[1px]">
                  <span className="flex-grow">
                    {user?.date?.toDateString()}
                  </span>
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
                    label: user?.country || "",
                    value: user?.country || "",
                  }}
                  onChange={handleCountryChange}
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

      <div
        ref={cardRef}
        className="w-96 bg-customColor-header p-6 rounded-2xl text-white transform transition-transform duration-500 hover:rotateX-6 hover:scale-125 hover:rotateY-6 hover:shadow-2xl hover:shadow-black/50 relative flex flex-col items-center mt-6 md:mt-0"
      >
        <div className="bg-customColor-innovatio2 p-3 rounded-full mb-4 transform transition-transform duration-500 hover:scale-110">
          <img
            alt="Banner"
            src={user?.avatar}
            width={1920}
            height={1080}
            className="text-customColor-innovatio3 rounded-full h-24 w-24"
          />
        </div>
        <h2 className="text-xl font-bold mb-2 transform transition-transform duration-500 hover:scale-110">
          {user?.firstName}
        </h2>
        <button className="flex items-center bg-gray-800 px-4 py-2 rounded-full mb-4 transform transition-transform duration-500 hover:scale-110">
          <FaShareAlt className="text-white mr-2" />
          Share
        </button>
        <div className="mt-4 text-center w-full">
          <div className="flex justify-between mb-4">
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Posts</p>
              <p>{user?.postCount}</p>
            </div>
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Comments</p>
              <p>1</p>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Favorites</p>
              <p>1</p>
            </div>
          </div>
          <div className="mb-4 transform transition-transform duration-500 hover:scale-110">
            <p className="font-semibold">Birthday</p>
            <p>{user?.date?.toLocaleDateString()}</p>
          </div>
          <div className="mb-4 transform transition-transform duration-500 hover:scale-110">
            <p className="font-semibold">Rol</p>
            <p className="flex items-center justify-center">
              Full Stack Developer
              <ComputerIcon className="size-5 ml-2" />
            </p>
          </div>
        </div>
        <div className="mt-6 w-full">
          <h3 className="font-semibold mb-2">SETTINGS</h3>
          <div className="flex justify-between items-center mb-4 transform transition-transform duration-500 hover:scale-110">
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>
              </div>
              <p className="ml-2">Profile</p>
            </div>
            <Button
              className="bg-gray-800 px-4 py-2 rounded-full hover:bg-white hover:text-black"
              onClick={() => {}}
            >
              Edit Profile
            </Button>
          </div>
          <h3 className="font-semibold mb-2">LINKS</h3>
          <div className="flex items-center justify-center gap-4">
            {user?.facebook && (
              <Link
                href={user?.facebook}
                className="text-white"
                prefetch={false}
              >
                <FaFacebook className="w-6 h-6" />
              </Link>
            )}
            {user?.instagram && (
              <Link
                href={user?.instagram}
                className="text-white"
                prefetch={false}
              >
                <FaInstagram className="w-6 h-6" />
              </Link>
            )}
            {user?.twitter && (
              <Link
                href={user?.twitter}
                className="text-white"
                prefetch={false}
              >
                <FaTwitter className="w-6 h-6" />
              </Link>
            )}
            {user?.linkedin && (
              <Link
                href={user?.linkedin}
                className="text-white"
                prefetch={false}
              >
                <FaLinkedin className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
