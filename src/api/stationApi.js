import axiosInstance from "./axiosInstance";

export const stationApi = {
  getAll: () => axiosInstance.get("/stations"),
  getById: (id) => axiosInstance.get(`/stations/${id}`),
  getSlots: (id, date) =>
    axiosInstance.get(`/stations/${id}/slots`, { params: { date } }),
  getLog: (id) => axiosInstance.get(`/stations/${id}/log`),
  create: (data) => axiosInstance.post("/stations", data),
  updateFuel: (id, data) => axiosInstance.put(`/stations/${id}/fuel`, data),
  toggle: (id) => axiosInstance.patch(`/stations/${id}/toggle`),
};
