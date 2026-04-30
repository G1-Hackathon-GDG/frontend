import axios from "axios";

const BASE = "https://fuelpass-r2ha.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = window.__accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthAttempt =
      url.includes("/auth/login") ||
      url.includes("/auth/admin/login") ||
      url.includes("/auth/register");

    if (status === 401 && !isAuthAttempt) {
      window.__accessToken = null;
      window.dispatchEvent(new CustomEvent("fuelpass:unauthorized"));
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
