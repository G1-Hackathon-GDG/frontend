import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSocketContext } from "../context/SocketContext";

export function useVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { lastVoucherIssued, lastVoucherRedeemed, lastVoucherCancelled } =
    useSocketContext();

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/vouchers/my");
      // backend returns { vouchers: [...] } or { voucher: {...} }
      const data =
        res.data?.vouchers ?? (res.data?.voucher ? [res.data.voucher] : []);
      setVouchers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vouchers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Re-fetch on every socket event — keeps dashboard perfectly in sync
  useEffect(() => {
    if (lastVoucherIssued) fetchVouchers();
  }, [lastVoucherIssued, fetchVouchers]);
  useEffect(() => {
    if (lastVoucherRedeemed) fetchVouchers();
  }, [lastVoucherRedeemed, fetchVouchers]);
  useEffect(() => {
    if (lastVoucherCancelled) fetchVouchers();
  }, [lastVoucherCancelled, fetchVouchers]);

  return { vouchers, loading, error, refetch: fetchVouchers };
}
