import axiosInstance from "./axiosInstance";

export const verifyVoucher = async (token) => {
  return axiosInstance.get(`/vouchers/verify/${token}`);
};

export const redeemVoucher = async (token) => {
  return axiosInstance.post("/vouchers/redeem", { token });
};

export const getMyVouchers = async () => {
  return axiosInstance.get("/vouchers/my");
};
