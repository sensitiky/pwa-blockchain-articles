'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { FaCamera } from 'react-icons/fa';
import Select, { SingleValue } from 'react-select';
import countryList from 'react-select-country-list';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../context/authContext';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import ModalUserDelete from '@/assets/userdelete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import axios from 'axios';
import { User } from '@/interfaces/interfaces2';
const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

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
  const [profileImage, setProfileImage] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const avatarUrl = user.avatar ? `${API_URL}${user.avatar}` : '';
      setProfileImage(avatarUrl ? `${avatarUrl}?${new Date().getTime()}` : '');
      setBio(user.bio || '');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
      avatar: userInfo.avatar || user?.avatar,
    });
  };

  const handleCountryChange = (
    selectedOption: SingleValue<{ label: string; value: string }>
  ) => {
    setUserInfo({
      ...userInfo,
      country: selectedOption?.value || '',
      avatar: userInfo.avatar || user?.avatar,
    });
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setUserInfo({
        ...userInfo,
        date: date.toDate(),
        avatar: userInfo.avatar || user?.avatar,
      });
    } else {
      setUserInfo({
        ...userInfo,
        date: null,
        avatar: userInfo.avatar || user?.avatar,
      });
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
        return; // Do not exit edit mode if the operation failed
      }
    }
    setBioEditMode(!bioEditMode);
  };

  const handleEditBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleProfileSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Update local state immediately
    setUser({
      ...user,
      ...userInfo,
      id: user?.id || 0,
      date: userInfo.date || undefined,
    });

    try {
      // Send the request to the backend asynchronously
      await axios.put(`${API_URL}/users/me`, userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error saving profile information:', error);
    }
  };

  const formatBio = (bioText: string) => {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    let formattedText = bioText.replace(urlRegex, (url) => {
      return `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    formattedText = formattedText.replace(
      /\n/g,
      '<br style="margin-bottom: 1rem;">'
    );

    formattedText = formattedText.replace(/\t/g, '&emsp;');

    return formattedText;
  };

  const handleBioSave = async (): Promise<boolean> => {
    const validBioPattern = /^[a-zA-Z0-9\s.,!?'"´\-_:\/?&=áéíóúÁÉÍÓÚñÑüÜ]*$/;
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    if (!validBioPattern.test(bio)) {
      alert(
        'Bio contains invalid characters. Only letters, numbers, spaces, and common punctuation are allowed.'
      );
      return false;
    }

    // Update the local state immediately
    setUserInfo({ ...userInfo, bio });
    setUser({ ...user, id: user?.id || 0, bio });

    try {
      await axios.put(
        `${API_URL}/users/me`,
        { ...userInfo, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (error) {
      console.error('Error saving bio:', error);
      return false;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > 5) {
      alert('The image file size should not exceed 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await uploadAvatar(formData);
      const avatarUrl = formatAvatarUrl(response.data.avatar);
      updateProfileImage(avatarUrl);

      // Update the user object in the context
      if (user) {
        setUser({
          ...user,
          avatar: avatarUrl,
        });
      }

      await refreshUserProfile();
    } catch (error) {
      handleAvatarUploadError(error);
    }
  };

  const uploadAvatar = async (formData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return await axios.put(`${API_URL}/users/me`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
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

  const handleAvatarUploadError = (error: any) => {
    console.error('Error uploading avatar:', error);
    if (error.response && error.response.status === 401) {
      alert('Unauthorized. Please log in again.');
      logout();
    }
  };

  const refreshUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    }
  }, [role]);

  if (loading) {
    return (
      <Container>
        <Image
          src="/BLOGCHAIN.gif"
          width={200}
          height={200}
          alt="Blogchain Logo"
          className="animate-bounce"
        />
      </Container>
    );
  }

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `${API_URL}${user.avatar}`
    : '/default-avatar.webp';

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem('token');
    if (deleteConfirmation === 'Delete') {
      try {
        await axios.delete(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const ensureAbsoluteUrl = (url?: string) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 h-auto">
      <div className="flex justify-center mb-8 sm:mb-12">
        <Button
          variant="outline"
          className="w-fit bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg px-4 sm:px-6 py-2 sm:py-3"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Profile
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:space-x-8 xl:space-x-20 px-2 sm:px-4 md:px-6">
        <div className="flex-1 flex flex-col items-center lg:items-start max-w-4xl w-full">
          <div className="flex items-center gap-4 sm:gap-8 flex-col sm:flex-row mb-6 sm:mb-10 w-full">
            <CardContainer className="inter-var mx-auto">
              <CardBody className="text-card-foreground rounded-xl w-full h-full transition-transform duration-300 ease-in-out relative flex justify-center items-center hover:shadow-xl">
                <CardItem translateZ="50" className="relative z-10">
                  <Avatar className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-primary">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{user?.firstName}</AvatarFallback>
                  </Avatar>
                </CardItem>
              </CardBody>
            </CardContainer>
            <div className="flex flex-col items-center sm:items-start">
              <label
                htmlFor="profile-image-upload"
                className="cursor-pointer hover:opacity-80 transition duration-300 ease-in-out mb-2 sm:mb-4"
              >
                <FaCamera className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <input
                  id="profile-image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center sm:text-left text-[#000916]">
                Hi, {user?.user}
              </h1>
            </div>
          </div>
          <div className="flex-1 w-full max-w-5xl mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
            <div className="space-y-4 sm:space-y-6">
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
                        : 'No date available'}
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
                      label: userInfo.country || '',
                      value: userInfo.country || '',
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
                {editMode ? 'Save Changes' : 'Edit Information'}
              </Button>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#000916]">
                  Bio
                </h2>
                {bioEditMode ? (
                  <div>
                    <textarea
                      value={bio}
                      onChange={handleEditBio}
                      rows={8}
                      maxLength={360}
                      className="w-full p-2 sm:p-3 border-2 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 ease-in-out text-sm sm:text-base"
                    />
                    <div className="text-right text-gray-500 mt-1 text-sm">
                      {bio.length}/360
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-base sm:text-lg leading-relaxed"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: formatBio(bio) }}
                  ></p>
                )}
              </div>

              <Button
                variant="outline"
                className="hover:text-white w-full bg-[#000916] hover:bg-[#000916]/80 text-white font-semibold py-2 sm:py-3 rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg text-sm sm:text-base"
                onClick={handleBioEditToggle}
              >
                {bioEditMode ? 'Save Changes' : 'Edit Bio'}
              </Button>
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                {user?.facebook && (
                  <Link
                    href={ensureAbsoluteUrl(user?.facebook)}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaFacebook className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Link>
                )}
                {user?.instagram && (
                  <Link
                    href={ensureAbsoluteUrl(user?.instagram)}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaInstagram className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Link>
                )}
                {user?.twitter && (
                  <Link
                    href={ensureAbsoluteUrl(user?.twitter)}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaTwitter className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Link>
                )}
                {user?.linkedin && (
                  <Link
                    href={ensureAbsoluteUrl(user?.linkedin)}
                    className="text-primary hover:text-primary-dark transition duration-300 ease-in-out"
                    prefetch={false}
                  >
                    <FaLinkedin className="w-6 h-6 sm:w-8 sm:h-8" />
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
