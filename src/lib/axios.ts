import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Cache ringan di memori untuk request GET (TTL 15 detik)
const getCache = new Map<string, { data: AxiosResponse; expiry: number }>();
const CACHE_TTL = 60_000;

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || 'get').toLowerCase();
    if (method !== 'get') {
      // Bersihkan cache jika ada aksi simpan/update/hapus (POST/PUT/DELETE)
      getCache.clear();
    } else {
      const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`;
      const cached = getCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        config.adapter = () => Promise.resolve(cached.data);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const method = (response.config.method || 'get').toLowerCase();
    if (method === 'get') {
      const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params || {})}`;
      getCache.set(cacheKey, {
        data: response,
        expiry: Date.now() + CACHE_TTL,
      });
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan pada server';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);