import axios from 'axios';

// Use relative URL since Next.js rewrites handle the proxy
const API_BASE = '/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password, role: 'LANDLORD' });
    return response.data;
  },
};

// Users API
export const usersApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Tenants API
export const tenantsApi = {
  getAll: async (search?: string) => {
    const response = await api.get('/tenants', { params: { search } });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },
  
  create: async (data: { name: string; nationalIdHash?: string }) => {
    const response = await api.post('/tenants', data);
    return response.data;
  },
  
  rateTenant: async (id: number, data: { score: number; comment?: string; proofUrl?: string }) => {
    const response = await api.post(`/tenants/${id}/ratings`, data);
    return response.data;
  },
};

// Listings API
export const listingsApi = {
  getAll: async (filters?: { location?: string; minRent?: number; maxRent?: number }) => {
    const response = await api.get('/listings', { params: filters });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  
  create: async (data: { title: string; rent: number; location: string; pictures?: string[] }) => {
    const response = await api.post('/listings', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<{ title: string; rent: number; location: string; pictures: string[] }>) => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

// Upload API
export const uploadApi = {
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.urls;
  },
}; 