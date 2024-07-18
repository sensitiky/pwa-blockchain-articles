import api from './api';

export const login = async (email: string, contrasena: string) => {
  const response = await api.post('/auth/login', { email, contrasena });
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response.data;
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data", error);
    throw error;
  }
};

export const updateProfile = async (profileData: any) => {
  const response = await api.put('http://localhost:4000/users/me', profileData);
  return response.data;
};

export default api;
