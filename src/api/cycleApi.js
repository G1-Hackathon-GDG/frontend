import axiosInstance from "./axiosInstance";

export const cycleApi = {
  getActive: () => axiosInstance.get("/cycles/active"),
  getAll: () => axiosInstance.get("/cycles"),
  create: (data) => axiosInstance.post("/cycles", data),
  close: (id) => axiosInstance.patch(`/cycles/${id}/close`),
};
