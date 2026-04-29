import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://fuelpass-r2ha.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = window.__accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

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
          "https://fuelpass-r2ha.onrender.com/api/auth/refresh",
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
