export const STORAGE_KEY = 'jwt_access_token';

export function getAccessToken() {
  const checkSession = import.meta.env.VITE_USE_SESSION_STORAGE === 'true';
  if (checkSession) {
    return sessionStorage.getItem(STORAGE_KEY);
  }
  return localStorage.getItem(STORAGE_KEY);
}
