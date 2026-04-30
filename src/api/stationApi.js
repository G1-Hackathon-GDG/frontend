import axiosInstance from "./axiosInstance";

export const getStations = async () => {
  return axiosInstance.get("/stations");
};

export const getStationById = async (id) => {
  return axiosInstance.get(`/stations/${id}`);
};

export const getStationLog = async (id) => {
  return axiosInstance.get(`/stations/${id}/log`);
};

export const updateStationFuel = async (id, fuelLiters) => {
  return axiosInstance.put(`/stations/${id}/fuel`, { fuelLiters });
};

export const toggleStationActive = async (id) => {
  return axiosInstance.patch(`/stations/${id}/toggle`);
};
