import api from './api';

export const login = async (usuario: string, contrasena: string) => {
  const response = await api.post('/auth/login', { usuario, contrasena });
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await api.put('/users/me', profileData);
  return response.data;
};
