import axios from 'axios';

// Membuat instance axios terpusat
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🟢 1. REQUEST INTERCEPTOR: Otomatis selipkan token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Sesuaikan dengan key token yang Anda simpan saat login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. RESPONSE INTERCEPTOR: Menangani response dan error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan pada server';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);