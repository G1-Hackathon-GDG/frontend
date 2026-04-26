import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

export function useVoucher() {
  const { token, user } = useAuth();
  const { socket } = useSocketContext();

  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/vouchers/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVouchers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchVouchers();
  }, [token]);

  // REAL-TIME UPDATES
  useEffect(() => {
    if (!socket) return;

    socket.on("voucher_issued", (data) => {
      setVouchers((prev) => [data, ...prev]);
    });

    socket.on("voucher_redeemed", (data) => {
      setVouchers((prev) =>
        prev.map((v) => (v._id === data._id ? data : v))
      );
    });

    socket.on("voucher_cancelled", (data) => {
      setVouchers((prev) =>
        prev.filter((v) => v._id !== data._id)
      );
    });

    return () => {
      socket.off("voucher_issued");
      socket.off("voucher_redeemed");
      socket.off("voucher_cancelled");
    };
  }, [socket]);

  return { vouchers };
}