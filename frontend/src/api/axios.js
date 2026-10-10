import axios from 'axios';

export const TOKEN_KEY = 'hospital_token';

/**
 * Normalizes the API base URL.
 * Ensures the base URL always points to the '/api' prefix, preventing 404s
 * when VITE_API_URL is configured without '/api' (e.g. on Vercel deployment),
 * and handles trailing slashes properly.
 */
export const normalizeApiUrl = (url) => {
  const fallback = 'http://localhost:5000/api';
  if (!url || typeof url !== 'string') return fallback;
  const cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned) return fallback;
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env?.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired/invalid token on a protected call signs the user out (login failures are ignored).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.startsWith('/auth/login') && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

/** Unwrap { success, message, data } and return the full payload. */
export const unwrap = (promise) => promise.then((res) => res.data);

export default api;
