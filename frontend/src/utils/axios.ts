import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

import { getAccessToken } from 'src/auth/context/jwt/constant';

const { protocol } = window.location;
const address = window.location.hostname;
const configServerUrl = CONFIG.site.serverUrl;
const configServerPort = CONFIG.site.serverPort;
const isExe = CONFIG.site.viteExe;
const baseURL = isExe ? `${protocol}//${address}:${configServerPort}` : configServerUrl;

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/users/profile',
    signIn: '/auth/login',
    signInAdmin: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password/send-otp',
    forgotPasswordVerifyOtp: '/auth/forgot-password/verify-otp',
  },
  organization: {
    getAll: '/admin/organizations',
    create: '/admin/organizations',
    update: (id: number) => `/admin/organizations/${id}`,
    getById: (id: number) => `/admin/organizations/${id}`,
    delete: (id: number) => `/admin/organizations/${id}`,
    search: '/admin/organizations/search',
  },
  organizationBranch: {
    getAll: '/admin/branches',
    create: '/admin/branches',
    update: (id: number) => `/admin/branches/${id}`,
    getById: (id: number) => `/admin/branches/${id}`,
    delete: (id: number) => `/admin/branches/${id}`,
    search: '/admin/branches/search',
    switch: '/admin/switch-branch',
  },
  configurationModule: {
    getAll: '/configurations',
    getBymoduleAndSubModule: '/configurations/module-configs',
    create: '/configurations/vendor',
    update: '/configurations/bulk-update',
    delete: (id: number) => `/configurations/vendor/${id}`,
    getById: (id: number) => `/configurations/vendor/${id}`,
  },
  user: {
    loginUser: '/loginuser/list',
    getAll: '/users',
    create: '/users',
    update: (id: number) => `/users/${id}`,
    getById: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
    updatePassword: (id: number) => `/users/${id}/update-password`,
    search: '/users/search',
  },
  patientRegistration: {
    getAll: '/patient-registrations',
    visit: '/check-visits',
    create: '/patient-registrations',
    update: (id: number) => `/patient-registrations/${id}`,
    delete: (id: number) => `/patient-registrations/${id}`,
    getById: (id: number) => `/patient-registrations/${id}`,
    search: '/patient-registrations/search',
  },
  recording: {
    session: '/recordings',
    getById : (id: number) => `/recordings/${id}`,
    sessionStart: '/recordings/start',
    sessionChunks: (sessionId: string) => `/recordings/${sessionId}/chunk`,
    sessionStop: (sessionId: string) => `/recordings/${sessionId}/stop`,
    sessionCapture: (sessionId: string) => `/recordings/${sessionId}/capture`,
    getAllCaptures: (sessionId: string) => `/recordings/${sessionId}/captures`,
  }
};
