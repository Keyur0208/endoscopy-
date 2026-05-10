import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Token format is invalid. Skipping decode.');
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.warn('Error decoding token, returning null:', error);
    return null; // Skip errors and return null
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || typeof decoded.exp !== 'number') {
      console.warn('Token is invalid or missing exp field.');
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.warn('Error during token validation. Assuming token is invalid:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert('Token expired!');
      const checkSession = CONFIG.sessionStorage.useSessionStorage;
      if (checkSession) {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(`${STORAGE_KEY}_expiry`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(`${STORAGE_KEY}_expiry`);
      }
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      const expiryTime = Date.now() + SESSION_DURATION;
      if (CONFIG.sessionStorage.useSessionStorage) {
        sessionStorage.setItem(STORAGE_KEY, accessToken);
        sessionStorage.setItem(`${STORAGE_KEY}_expiry`, expiryTime.toString());
      } else {
        localStorage.setItem(STORAGE_KEY, accessToken);
        localStorage.setItem(`${STORAGE_KEY}_expiry`, expiryTime.toString());
      }

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      const checkSession = CONFIG.sessionStorage.useSessionStorage;
      if (checkSession) {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(`${STORAGE_KEY}_expiry`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(`${STORAGE_KEY}_expiry`);
      }
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
