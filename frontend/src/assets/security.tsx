import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";

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

interface SecuritySettingsProps {
  profileImage: string;
  userInfo: UserInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditToggle: () => void;
  handleProfileSave: (updatedInfo: UserInfo) => void;
  editMode: boolean;
}

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

export default SecuritySettings;
