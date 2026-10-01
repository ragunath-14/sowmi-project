import axios from 'axios';

const TOKEN_KEY = 'jsonToken';
const ADMIN_KEY = 'isAdmin';

// Centralized session handling: any API call anywhere in the app that comes
// back 401 (missing/invalid/expired token) clears the stale session and sends
// the user to log in again, instead of each page having to handle it itself.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
