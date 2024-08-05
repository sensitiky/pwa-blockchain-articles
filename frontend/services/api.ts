import axios from 'axios';

const api = axios.create({
  baseURL: 'http://149.50.141.173:4000',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
