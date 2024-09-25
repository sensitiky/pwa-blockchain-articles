'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Avatar,
  IconButton,
  InputAdornment,
  Tooltip,
  Modal,
  Box,
  Typography,
} from '@mui/material';
import { FaEdit, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';

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
  background-color: transparent;
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
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [currentField, setCurrentField] = useState<'email' | 'password'>(
    'email'
  );
  const fieldLabels: Record<keyof UserProfile, string | undefined> = {
    id: undefined,
    firstName: undefined,
    avatar: undefined,
    medium: 'Medium',
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
  };
  useEffect(() => {
    if (user) {
      const avatarUrl = user?.avatar
        ? user.avatar.startsWith('http')
          ? user.avatar
          : `${API_URL}${user.avatar}`
        : '/default-avatar.webp';
      setUserInfo({
        id: user.id,
        firstName: user.firstName,
        avatar: avatarUrl,
        medium: user.medium,
        instagram: user.instagram,
        facebook: user.facebook,
        twitter: user.twitter,
        linkedin: user.linkedin,
        email: user.email,
      });
      setLoading(false);
    }
  }, [user]);

  const handleSendVerificationCode = async (field: 'email' | 'password') => {
    setSendingCode(true);
    setMessage(null);
    setOpenModal(true);
    setCurrentField(field);
    try {
      const response = await axios.post(
        `${API_URL}/auth/send-verification-code`,
        { email: userInfo.email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCodeSent(true);
        setMessage({
          text: 'Verification code sent to your email',
          isError: false,
        });
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (err) {
      setMessage({ text: 'Failed to send verification code', isError: true });
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async (code: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-code`,
        { email: userInfo.email, code },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage({
          text: 'Code verified successfully',
          isError: false,
        });
        setOpenModal(false);
        return true;
      } else {
        throw new Error('Failed to verify code');
      }
    } catch (err) {
      setMessage({ text: 'Failed to verify code', isError: true });
      return false;
    }
  };

  const handleSaveChanges = async (field: string) => {
    if (field === 'email' || field === 'password') {
      await handleSendVerificationCode(field);
      return;
    }

    const updatedField: Partial<UserProfile> & { id: number } = {
      id: userInfo.id ?? 0,
      [field]: userInfo[field as keyof UserProfile],
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/me`, updatedField, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const newToken = response.data.token; // Assuming the new token is returned in the response
      localStorage.setItem('token', newToken); // Update the token in local storage
      setUser({ ...user, ...updatedField });
      setEditingField(null);
    } catch (error) {
      console.error('Error saving profile information:', error);
    }
  };

  const handleVerifyAndSave = async () => {
    const isVerified = await verifyCode(verificationCode);
    if (isVerified) {
      const updatedField: Partial<UserProfile> & { id: number } = {
        id: userInfo.id ?? 0,
        [currentField]: currentField === 'password' ? password : userInfo.email,
      };

      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/me`, updatedField, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const newToken = response.data.token; // Assuming the new token is returned in the response
        localStorage.setItem('token', newToken); // Update the token in local storage
        setUser({ ...user, ...updatedField });
        setEditingField(null);
        if (currentField === 'password') {
          setPassword('');
        }
        setOpenModal(false);
      } catch (error) {
        console.error('Error saving profile information:', error);
      }
    }
  };

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

  return (
    <motion.div
      className="flex items-center justify-center"
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
          {(
            [
              'medium',
              'instagram',
              'facebook',
              'twitter',
              'linkedin',
            ] as (keyof UserProfile)[]
          ).map((field) => (
            <FieldContainer key={field}>
              <FieldLabel>{fieldLabels[field]}</FieldLabel>
              {editingField === field ? (
                <TextField
                  name={field}
                  value={userInfo[field] || ''}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, [field]: e.target.value })
                  }
                  variant="outlined"
                  size="small"
                  onBlur={() => handleSaveChanges(field)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Save">
                          <IconButton onClick={() => handleSaveChanges(field)}>
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
                      userInfo[field] ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    {userInfo[field] ? 'Provided' : 'Not Provided'}
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
        <Section>
          <SectionTitle>Security</SectionTitle>
          <FieldContainer>
            <FieldLabel>Email</FieldLabel>
            {editingField === 'email' ? (
              <TextField
                name="email"
                value={userInfo.email || ''}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Save">
                        <IconButton
                          onClick={() => handleSendVerificationCode('email')}
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
                <span className="text-sm text-green-500">{userInfo.email}</span>
                <ActionIcons>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEditingField('email')}>
                      <FaEdit color="#007bff" />
                    </IconButton>
                  </Tooltip>
                </ActionIcons>
              </div>
            )}
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Password</FieldLabel>
            {editingField === 'password' ? (
              <div className="flex flex-col gap-2">
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="New password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  className="rounded-full bg-[#000916] hover:bg-[#000916]/80"
                  onClick={() => handleSendVerificationCode('password')}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-500">••••••••</span>
                <ActionIcons>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEditingField('password')}>
                      <FaEdit color="#007bff" />
                    </IconButton>
                  </Tooltip>
                </ActionIcons>
              </div>
            )}
          </FieldContainer>
        </Section>
      </Card>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Verify Your Email
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Please enter the verification code sent to your email to confirm
            your {currentField} change.
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              color="primary"
              onClick={handleVerifyAndSave}
              className="rounded-full bg-[#000916] hover:bg-[#000916]/80 font-normal"
            >
              Verify and Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default SecuritySettings;
