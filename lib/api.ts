import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('learnrr_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('learnrr_token');
      localStorage.removeItem('learnrr_user');
    }
    return Promise.reject(err);
  }
);

// Universities
export const getUniversities = (params?: Record<string, string>) => api.get('/universities', { params });
export const getUniversity = (id: string) => api.get(`/universities/${id}`);

// Courses
export const getCourses = (params?: Record<string, string>) => api.get('/courses', { params });
export const getCourse = (id: string) => api.get(`/courses/${id}`);

// Auth
export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const signup = (data: { name: string; email: string; password: string; phone?: string }) => api.post('/auth/signup', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data: Record<string, unknown>) => api.put('/auth/profile', data);
export const saveCourse = (id: string) => api.post(`/auth/save-course/${id}`);

// Applications
export const submitApplication = (data: Record<string, unknown>) => api.post('/applications', data);
export const getMyApplications = () => api.get('/applications/my');
export const getApplication = (id: string) => api.get(`/applications/${id}`);

export default api;
