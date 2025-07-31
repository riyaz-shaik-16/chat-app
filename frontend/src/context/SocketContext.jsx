"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { chat_service, useAppData } from "./AppContext";

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAppData();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io("https://riyazcodes.duckdns.org", {
      withCredentials: true,
      path:"/ws/",
      query: {
        userId: user._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      // console.log("🔌 Connected:", socket?.id);
    });

    newSocket.on("connect_error", (err) => {
      // console.error("❌ Socket connect error:", err);
    });

    newSocket.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
