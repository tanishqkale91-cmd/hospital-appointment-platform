import axios from 'axios';

export const TOKEN_KEY = 'hospital_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
