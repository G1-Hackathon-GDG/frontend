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

let isRefreshing = false;
let failedQueue = [];
let hasRedirected = false; // ← prevent redirect loop

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${BASE}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        window.__accessToken = data.accessToken;
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.__accessToken = null;

        // Only redirect once — not on every failed request
        if (!hasRedirected) {
          hasRedirected = true;
          window.location.href = "/login";
          // Reset after navigation
          setTimeout(() => {
            hasRedirected = false;
          }, 3000);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
