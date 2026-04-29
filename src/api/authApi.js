import axiosInstance from "./axiosInstance";

export const authApi = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  adminLogin: (data) => axiosInstance.post("/auth/admin/login", data),
  getMe: () => axiosInstance.get("/auth/me"),
  refresh: () => axiosInstance.post("/auth/refresh"),
  logout: () => axiosInstance.post("/auth/logout"),
};
