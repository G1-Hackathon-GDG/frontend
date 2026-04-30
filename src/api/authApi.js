import axiosInstance from "./axiosInstance";

export const loginApi = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res;
};

export const getMe = async () => {
  return axiosInstance.get("/auth/me");
};

export const logoutApi = () => {
  localStorage.removeItem("token");
};