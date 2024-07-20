import React, { useRef, useState } from "react";
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
import Image from "next/image";

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

const user = {
  username: "Nearby-Rise7977",
  postLikes: 1,
  comments: 1,
  postKarma: 0,
  commentKarma: 0,
  cakeDay: "Jul 19, 2024",
  goldReceived: 0,
};

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
  const formattedDate = userInfo.date.toLocaleDateString();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-8 px-4 md:px-6">
      <div className="flex-1 flex flex-col">
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
              <Label className="text-2xl">Username</Label>
              {editMode ? (
                <Input
                  name="usuario"
                  value={userInfo.usuario}
                  onChange={handleInputChange}
                  className="focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center border-b-[1px]">
                  <span className="flex-grow">{userInfo.usuario}</span>
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

      <div
        ref={cardRef}
        className="w-96 bg-customColor-header p-6 rounded-lg text-white transform transition-transform duration-500 hover:rotateX-6 hover:rotateY-6 hover:shadow-2xl hover:shadow-black/50 relative flex flex-col items-center"
      >
        <div className="bg-customColor-innovatio2 p-3 rounded-full mb-4 transform transition-transform duration-500 hover:scale-110">
          <Image
            alt=""
            src={profileImage}
            className="text-customColor-innovatio3 h-6 w-6"
          />
        </div>
        <h2 className="text-xl font-bold mb-2 transform transition-transform duration-500 hover:scale-110">
          {userInfo.firstName}
        </h2>
        <button className="flex items-center bg-gray-800 px-4 py-2 rounded-full mb-4 transform transition-transform duration-500 hover:scale-110">
          <FaShareAlt className="text-white mr-2" />
          Share
        </button>
        <div className="mt-4 text-center w-full">
          <div className="flex justify-between mb-4">
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Saved Articles</p>
              <p>{user.postLikes}</p>
            </div>
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Comments</p>
              <p>{user.comments}</p>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Favorites</p>
              <p>{user.postKarma + user.commentKarma}</p>
            </div>
            <div className="text-center w-1/2 transform transition-transform duration-500 hover:scale-110">
              <p className="font-semibold">Articles</p>
              <p>{user.postKarma}</p>
            </div>
          </div>
          <div className="mb-4 transform transition-transform duration-500 hover:scale-110">
            <p className="font-semibold">Birthday</p>
            <p>{formattedDate}</p>
          </div>
        </div>
        <div className="mt-6 w-full">
          <h3 className="font-semibold mb-2">SETTINGS</h3>
          <div className="flex justify-between items-center mb-4 transform transition-transform duration-500 hover:scale-110">
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback>{userInfo.firstName}</AvatarFallback>
                </Avatar>
              </div>
              <p className="ml-2">Profile</p>
            </div>
            <Button
              className="bg-gray-800 px-4 py-2 rounded-full hover:bg-white hover:text-black"
              onClick={() => handleSectionChange("security")}
            >
              Edit Profile
            </Button>
          </div>
          <h3 className="font-semibold mb-2">LINKS</h3>
          <Button className="flex items-center bg-gray-800 px-4 py-2 rounded-full w-full justify-center hover:bg-white hover:text-black transform transition-transform duration-500 hover:scale-110">
            <AiOutlinePlus className="text-white mr-2 hover:text-black" />
            Add Social Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
