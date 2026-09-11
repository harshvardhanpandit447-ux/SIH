/**
 * AGRO VISION - Centralized API Configuration
 * Supports dynamic environment variables and seamless localhost / Vercel deployment
 */

export const getApiBase = (): string => {
  // 1. If explicit environment variable is configured in Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. If running in browser and localhost on non-5000 port (e.g. Vite dev server on 5173)
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && window.location.port === '5173') {
      return 'http://localhost:5000/api';
    }
  }

  // 3. In production / Vercel or relative proxy
  return '/api';
};

export const API_BASE = getApiBase();

export default API_BASE;
