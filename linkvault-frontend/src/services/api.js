import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// URLs
export const urlAPI = {
  create: (data) => api.post('/urls', data),
  getAll: (params) => api.get('/urls', { params }),
  getById: (id) => api.get(`/urls/${id}`),
  update: (id, data) => api.put(`/urls/${id}`, data),
  delete: (id) => api.delete(`/urls/${id}`),
  getDashboard: () => api.get('/urls/dashboard'),
  bulk: (data) => api.post('/urls/bulk', data),
};

// Analytics
export const analyticsAPI = {
  getUrlAnalytics: (id, days) => api.get(`/analytics/${id}`, { params: { days } }),
  getPublicStats: (shortCode) => api.get(`/analytics/public/${shortCode}`),
};

export default api;