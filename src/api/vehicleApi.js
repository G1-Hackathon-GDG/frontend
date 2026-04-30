import axiosInstance from "./axiosInstance";

export const vehicleApi = {
  getAll: () => axiosInstance.get("/vehicles/all"),
  getById: (id) => axiosInstance.get(`/vehicles/${id}`),
  verify: (id) => axiosInstance.patch(`/vehicles/${id}/verify`),
  flag: (id, reason) => axiosInstance.patch(`/vehicles/${id}/flag`, { reason }),
  unflag: (id) => axiosInstance.patch(`/vehicles/${id}/unflag`),
};
