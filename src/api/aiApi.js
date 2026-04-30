import axiosInstance from "./axiosInstance";

export const aiApi = {
  allocate: () => axiosInstance.post("/ai/allocate"),
  simulateShortage: () => axiosInstance.post("/ai/simulate-shortage"),
  fraudCheck: () => axiosInstance.post("/ai/fraud-check"),
  getLogs: (params) => axiosInstance.get("/ai/logs", { params }),
};
