"use client";
import Link from "next/link";
import { useState, useEffect, SVGProps, ChangeEvent } from "react";
import { FaCamera } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDown,
  faFilePen,
  faFilter,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/assets/header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProfile, updateProfile } from "../../../services/authService";
import React from "react";
import Footer from "@/assets/footer";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BookMarkedIcon } from "lucide-react";
import { FilePenIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import { UserIcon } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import TextField from "@mui/material/TextField";

const articles = [
  {
    id: 1,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Published",
    imageUrl: "/test.jpg",
  },
  {
    id: 3,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Draft",
    imageUrl: "/test.jpg",
  },
  {
    id: 4,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Published",
    imageUrl: "/test.jpg",
  },
  {
    id: 5,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Draft",
    imageUrl: "/test.jpg",
  },
  // Agrega más artículos según sea necesario
];

interface UserInfo {
  firstName: string;
  lastName: string;
  date: Date;
  email: string;
  usuario: string;
  country: string;
  medium: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  bio: string;
}

interface ProfileSettingsProps {
  profileImage: string;
  userInfo: UserInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryChange: (
    selectedOption: SingleValue<{ label: string; value: string }>
  ) => void;
  handleEditToggle: () => void;
  handleBioEditToggle: () => void;
  handleEditBio: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDateChange: (date: Date | null) => void;
  handleProfileSave: () => void;
  handleBioSave: () => void;
  handleSectionChange: (section: string) => void;
  editMode: boolean;
  bioEditMode: boolean;
  bio: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SecuritySettingsProps {
  profileImage: string;
  userInfo: UserInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditToggle: () => void;
  handleProfileSave: (updatedInfo: UserInfo) => void;
  editMode: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profileImage,
  userInfo,
  handleInputChange,
  handleCountryChange,
  handleEditToggle,
  handleBioEditToggle,
  handleEditBio,
  handleDateChange,
  handleProfileSave,
  handleBioSave,
  handleSectionChange,
  editMode,
  bioEditMode,
  bio,
  handleImageChange,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center pt-12 md:pt-24 px-4 md:px-6">
      <div className="flex items-center gap-6">
        <CardContainer className="inter-var mx-auto">
          <CardBody className="bg-inherit text-card-foreground border-none rounded-lg shadow-none w-full h-full transition-transform relative flex justify-center items-center">
            <CardItem translateZ="50" className="relative z-10">
              <Avatar className="w-36 h-36 md:w-36 md:h-36">
                <AvatarImage src={profileImage} />
                <AvatarFallback>{userInfo.firstName}</AvatarFallback>
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
        <h1 className="text-5xl md:text-5xl font-bold">
          Hi, {userInfo.firstName}
        </h1>
      </div>
      <div className="flex-1 w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
                <span className="flex-grow">{userInfo.firstName}</span>
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
                <span className="flex-grow">{userInfo.lastName}</span>
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
                <span className="flex-grow">
                  {userInfo.date.toDateString()}
                </span>
              </div>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="text-2xl">Email</Label>
            <div className="flex items-center border-b-[1px]">
              <span className="flex-grow">{userInfo.email}</span>
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-2xl">Country</Label>
            {editMode ? (
              <Select
                options={countryList().getData()}
                value={{ label: userInfo.country, value: userInfo.country }}
                onChange={handleCountryChange}
                className="w-full text-xl"
              />
            ) : (
              <div className="flex items-center border-b-[1px]">
                <span className="flex-grow">{userInfo.country}</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
            onClick={() => {
              handleProfileSave();
              handleEditToggle();
            }}
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
            onClick={() => {
              handleBioSave();
              handleBioEditToggle();
            }}
          >
            {bioEditMode ? "Save Changes" : "Edit Bio"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  profileImage,
  userInfo,
  handleInputChange,
  handleEditToggle,
  handleProfileSave,
  editMode,
}) => {
  const [localUserInfo, setLocalUserInfo] = useState<UserInfo>(userInfo);
  const [fieldsProvided, setFieldsProvided] = useState<{
    [key: string]: boolean;
  }>({
    medium: !!userInfo.medium,
    instagram: !!userInfo.instagram,
    facebook: !!userInfo.facebook,
    twitter: !!userInfo.twitter,
    linkedin: !!userInfo.linkedin,
  });

  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalUserInfo({ ...localUserInfo, [name]: value });
  };

  const handleSaveChanges = () => {
    handleProfileSave(localUserInfo);
    setFieldsProvided({
      medium: !!localUserInfo.medium,
      instagram: !!localUserInfo.instagram,
      facebook: !!localUserInfo.facebook,
      twitter: !!localUserInfo.twitter,
      linkedin: !!localUserInfo.linkedin,
    });
  };

  return (
    <div className="flex p-6 sm:p-10">
      <div className="mx-auto min-w-3xl">
        <div className="flex items-center gap-4">
          <CardContainer className="inter-var mx-auto">
            <CardBody className="bg-inherit text-card-foreground border-none rounded-lg shadow-none w-full h-full transition-transform relative flex justify-center items-center">
              <CardItem translateZ="50" className="relative z-10">
                <Avatar className="w-36 h-36 md:w-36 md:h-36">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback>{userInfo.firstName}</AvatarFallback>
                </Avatar>
              </CardItem>
            </CardBody>
          </CardContainer>
          <div>
            <h1 className="text-4xl font-bold">Hi, {userInfo.firstName}</h1>
            <p className="text-3xl text-muted-foreground">
              Welcome to your profile settings.
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-6">
          <div className="grid gap-2">
            {["medium", "instagram", "facebook", "twitter", "linkedin"].map(
              (field, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-xl font-medium capitalize border-b-2">
                    {field}
                  </div>
                  {editMode ? (
                    <TextField
                      id="standard-basic"
                      label="Edit here"
                      variant="standard"
                      name={field}
                      onChange={handleLocalInputChange}
                      value={String(localUserInfo[field as keyof UserInfo])}
                      className="border-none rounded-none w-3/9 border-gray-400 cursor-text"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`${
                          fieldsProvided[field]
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {fieldsProvided[field] ? "Provided" : "Not Provided"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditToggle}
                        className="bg-inherit hover:bg-inherit"
                      >
                        <FontAwesomeIcon icon={faFilePen} className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          {editMode && (
            <Button
              className="text-lg w-full bg-inherit border-none hover:bg-inherit text-black hover:underline hover:underline-offset-4 hover:decoration-black"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [selectedSection, setSelectedSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bio, setBio] = useState<string>("");
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    date: new Date(),
    email: "",
    usuario: "",
    country: "",
    medium: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    bio: "",
  });
  const { user, isAuthenticated } = useAuth();
  const [profileImage, setProfileImage] = useState<string>("");
  const options = countryList().getData();

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const profile = await getProfile();
          setUserInfo({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            date: profile.date ? new Date(profile.date) : new Date(),
            email: profile.email || "",
            usuario: profile.usuario || "",
            country: profile.country || "",
            medium: profile.medium || "",
            instagram: profile.instagram || "",
            facebook: profile.facebook || "",
            twitter: profile.twitter || "",
            linkedin: profile.linkedin || "",
            bio: profile.bio || "",
          });
          setProfileImage(profile.profileImage || "");
          setBio(profile.bio || "");
        } catch (error) {
          console.error("Error fetching profile data", error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleBioEditToggle = () => {
    setBioEditMode(!bioEditMode);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (userInfo[name as keyof UserInfo] !== value) {
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
    }
  };

  const handleCountryChange = (selectedOption: any) => {
    if (userInfo.country !== selectedOption.label) {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        country: selectedOption.label,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProfileImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (bio !== value) {
      setBio(value);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date && userInfo.date !== date) {
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, date }));
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(userInfo);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleBioSave = async () => {
    try {
      await updateProfile({ ...userInfo, bio });
      setBioEditMode(false);
    } catch (error) {
      console.error("Error updating bio", error);
    }
  };

  const SavedItems: React.FC = () => {
    const [liked, setLiked] = useState<boolean[]>(Array(3).fill(false));

    const toggleLike = (index: number) => {
      const newLiked = [...liked];
      newLiked[index] = !newLiked[index];
      setLiked(newLiked);
    };

    return (
      <section className="max-h-dvh w-full py-6 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800 mb-4">
            Your favorite items
          </h2>
          <div className="flex items-center justify-end gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                  Order
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Order by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Date (newest first)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Date (oldest first)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Title</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border-t-[1px] border-b-[1px] border-r-0 border-l-0 flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 bg-white shadow-none rounded-none"
              >
                <img
                  src="/test.jpg"
                  alt="Placeholder"
                  className="m-5 h-40 w-full md:w-auto md:h-44 rounded-lg border border-gray-300 mr-4"
                />
                <div className="flex items-center mb-4 md:mb-0">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Why Blockchain is Hard
                    </h3>
                    <div className="text-muted-foreground">
                      <UserIcon className="w-4 h-4 mr-1" />
                      Michael Chen
                    </div>
                    <p className="text-gray-600">
                      The hype around blockchain is massive. To hear the
                      blockchain hype train tell it, blockchain will now: Solve
                      income inequality. Make all data secure forever. Make
                      everything much more efficient and trustless. Save dying.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleLike(index)}
                    className="ml-2 p-2 focus:outline-none"
                  >
                    <BookMarkedIcon
                      className={`h-5 w-5 ${
                        liked[index] ? "text-yellow-500" : "text-gray-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const RenderContent = () => {
    if (!isAuthenticated) {
      router.push("/");
    }
    switch (selectedSection) {
      case "personal":
        return (
          <ProfileSettings
            profileImage={profileImage}
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handleCountryChange={handleCountryChange}
            handleEditToggle={handleEditToggle}
            handleBioEditToggle={handleBioEditToggle}
            handleEditBio={handleEditBio}
            handleDateChange={handleDateChange}
            handleProfileSave={handleProfileSave}
            handleBioSave={handleBioSave}
            handleSectionChange={handleSectionChange}
            editMode={editMode}
            bioEditMode={bioEditMode}
            bio={bio}
            handleImageChange={handleImageChange}
          />
        );

      case "security":
        return (
          <SecuritySettings
            profileImage={profileImage}
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handleEditToggle={handleEditToggle}
            handleProfileSave={handleProfileSave}
            editMode={editMode}
          />
        );

      case "saved":
        return <SavedItems />;

      case "articles":
        return (
          <>
            <div className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold">Your articles</h1>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FontAwesomeIcon
                        icon={faArrowsUpDown}
                        className="h-4 w-4"
                      />
                      Order
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Order by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Date (newest first)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Date (oldest first)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Title</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                      State
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by state</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Published
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="relative group overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                    <Badge
                      className={`mb-2 ${
                        article.status === "Published"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {article.status}
                    </Badge>
                    <Button
                      variant="outline"
                      className="text-white border-none hover:underline bg-transparent hover:bg-transparent hover:text-white"
                    >
                      Read More
                    </Button>
                  </div>
                  <h3 className="absolute top-0 left-0 right-0 text-lg font-normal mb-2 text-center text-black backdrop-blur-sm bg-opacity-20 bg-black p-2 z-10">
                    {article.title}
                  </h3>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-customColor-header">
      <Header />
      <div className="grid min-h-screen grid-cols-[1fr] md:grid-cols-[400px_1fr] bg-background text-foreground">
        <aside className="border-r border-border bg-customColor-header px-6 py-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold">Welcome</h2>
              <p className="text-customColor-welcome">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedSection("personal")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <UserIcon className="h-5 w-5" />
                Personal Information
              </button>
              <button
                onClick={() => setSelectedSection("security")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <LockIcon className="h-5 w-5" />
                Security & Social Links
              </button>
              <button
                onClick={() => setSelectedSection("saved")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <BookMarkedIcon className="h-5 w-5" />
                Saved Articles
              </button>
              <button
                onClick={() => setSelectedSection("articles")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <FilePenIcon className="h-5 w-5" />
                My Articles
              </button>
            </nav>
          </div>
        </aside>
        <main className="p-6 md:p-8">{RenderContent()}</main>
      </div>
      <div className="hidden lg:flex md:flex">
        <Footer />
      </div>
    </div>
  );
};

export default Users;
