import axiosInstance from "./axiosInstance";

export const voucherApi = {
  getMy: () => axiosInstance.get("/vouchers/my"),
  getHistory: (params) => axiosInstance.get("/vouchers/history", { params }),
  verify: (token) => axiosInstance.get(`/vouchers/verify/${token}`),
  redeem: (token) => axiosInstance.post("/vouchers/redeem", { token }),
  getAll: (params) => axiosInstance.get("/vouchers/all", { params }),
  getStats: () => axiosInstance.get("/vouchers/stats"),
  cancel: (id, reason) =>
    axiosInstance.patch(`/vouchers/${id}/cancel`, { reason }),
};
