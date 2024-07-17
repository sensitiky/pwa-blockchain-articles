import api from './api';

export const login = async (usuario: string, contrasena: string) => {
  const response = await api.post('https://blogchain.onrender.com/auth/login', { usuario, contrasena });
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('https://blogchain.onrender.com/users/me');
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await api.put('https://blogchain.onrender.com/users/me', profileData);
  return response.data;
};
