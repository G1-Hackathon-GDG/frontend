import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const userIdRef = useRef(null); // track userId to avoid reconnecting for same user

  const [connected, setConnected] = useState(false);
  const [lastVoucherIssued, setLastVoucherIssued] = useState(null);
  const [lastVoucherRedeemed, setLastVoucherRedeemed] = useState(null);
  const [lastVoucherCancelled, setLastVoucherCancelled] = useState(null);
  const [shortageAlert, setShortageAlert] = useState(null);

  useEffect(() => {
    const userId = user?._id || user?.id || null;

    // Don't reconnect if it's the same user already connected
    if (userId && userId === userIdRef.current && socketRef.current?.connected)
      return;

    // Disconnect existing socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }

    if (!user || !userId) {
      userIdRef.current = null;
      return;
    }

    userIdRef.current = userId;

    const socket = io("https://fuelpass-r2ha.onrender.com", {
      auth: { token: window.__accessToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3, // don't reconnect forever
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => setConnected(false));
    socket.on("voucher_issued", (d) => setLastVoucherIssued(d));
    socket.on("voucher_redeemed", (d) => setLastVoucherRedeemed(d));
    socket.on("voucher_cancelled", (d) => setLastVoucherCancelled(d));
    socket.on("shortage_alert", (d) => setShortageAlert(d));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]); // only re-run when user actually changes

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        lastVoucherIssued,
        lastVoucherRedeemed,
        lastVoucherCancelled,
        shortageAlert,
        clearShortageAlert: () => setShortageAlert(null),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
