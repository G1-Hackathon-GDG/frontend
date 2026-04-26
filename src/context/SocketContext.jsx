import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // join user room
      newSocket.emit("join", user._id);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}