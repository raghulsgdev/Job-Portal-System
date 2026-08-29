import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('user_access_token');
    const hrToken = localStorage.getItem('hr_access_token');
    const activeRole = localStorage.getItem('active_role');

    let token = null;
    if (activeRole === 'hr' && hrToken) {
      token = hrToken;
    } else if (userToken) {
      token = userToken;
    } else if (hrToken) {
      token = hrToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle unauthenticated 401 response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const activeRole = localStorage.getItem('active_role');
      if (activeRole === 'hr') {
        localStorage.removeItem('hr_access_token');
      } else {
        localStorage.removeItem('user_access_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
