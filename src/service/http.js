import axios from 'axios';

// Prefer same-origin proxy ("/api", "/api/login", "/api/logout", "/sanctum/*") via main router.
// Falls back to explicit host if provided.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/';
const strategy = import.meta.env.VITE_AUTH_STRATEGY || 'token';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

api.interceptors.request.use((config) => {
  const hasSessionCookie = typeof document !== 'undefined' && /(?:^|; )krbs_session=/.test(document.cookie);
  if (strategy === 'token' && !hasSessionCookie) {
    const token = localStorage.getItem('auth.token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (config?.headers?.Authorization && hasSessionCookie) {
    // Prefer cookie-based session when present
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('auth.token');
      // Let route guards handle navigation
    }
    return Promise.reject(error);
  }
);