import axios from "axios";
import {config} from "@/utils/constants";
import toast from "react-hot-toast";

const API_URL = config.apiUrl;
const SUPER_ADMIN_TOKEN_KEY = "smartnshine_super_admin_token";

// Storage helpers
export const superAdminStorage = {
  getToken: () => {
    return (
      sessionStorage.getItem(SUPER_ADMIN_TOKEN_KEY) ||
      localStorage.getItem(SUPER_ADMIN_TOKEN_KEY)
    );
  },
  setToken: (token, remember = true) => {
    if (remember) {
      localStorage.setItem(SUPER_ADMIN_TOKEN_KEY, token);
    }
    sessionStorage.setItem(SUPER_ADMIN_TOKEN_KEY, token);
  },
  clearToken: () => {
    sessionStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
    localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
  },
  isAuthenticated: () => {
    return Boolean(superAdminStorage.getToken());
  },
};

// Create dedicated axios instance for Super Admin
const superAdminAPI = axios.create({
  baseURL: `${API_URL}/super-admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach super admin token
superAdminAPI.interceptors.request.use(
  (reqConfig) => {
    const token = superAdminStorage.getToken();
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
superAdminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if we are already testing login endpoint
      if (!error.config.url.includes("/auth/login")) {
        superAdminStorage.clearToken();
        if (!window.location.pathname.includes("/super-admin/login")) {
          toast.error("Super Admin session expired. Please log in again.");
          window.location.href = "/super-admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API ENDPOINTS
// ==========================================

// Super Admin Auth
export const loginSuperAdmin = async (password, remember = true) => {
  const response = await superAdminAPI.post("/auth/login", {password});
  if (response.data?.token) {
    superAdminStorage.setToken(response.data.token, remember);
  }
  return response.data;
};

export const verifySuperAdminSession = async () => {
  return (await superAdminAPI.get("/auth/verify")).data;
};

export const changeSuperAdminPassword = async (newPassword, currentPassword) => {
  return (
    await superAdminAPI.post("/auth/change-password", {
      newPassword,
      currentPassword,
    })
  ).data;
};

// Environment Variables Management
export const getEnvVariables = async () => {
  return (await superAdminAPI.get("/env")).data;
};

export const updateEnvVariables = async (variables) => {
  return (await superAdminAPI.post("/env", {variables})).data;
};

export const updateRawEnv = async (rawContent) => {
  return (await superAdminAPI.post("/env/raw", {rawContent})).data;
};

// 1-Click Key Testing
export const testApiKey = async (service, apiKey, secondaryKey) => {
  return (
    await superAdminAPI.post("/env/test-key", {
      service,
      apiKey,
      secondaryKey,
    })
  ).data;
};

// Backup & Rollback
export const getEnvBackups = async () => {
  return (await superAdminAPI.get("/env/backups")).data;
};

export const restoreEnvBackup = async (filename) => {
  return (await superAdminAPI.post("/env/restore", {filename})).data;
};

// System Status
export const getSystemStatus = async () => {
  return (await superAdminAPI.get("/system/status")).data;
};

export default superAdminAPI;
