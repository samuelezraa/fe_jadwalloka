import axios from 'axios';

// Membuat instance axios terpusat
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menangani response dan error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Menampilkan pesan error jika terjadi kegagalan request API
    const message = error.response?.data?.message || 'Terjadi kesalahan pada server';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);