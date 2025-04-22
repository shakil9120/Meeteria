import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return; // Early exit if no username

    console.log("connecting to ", import.meta.env.VITE_APP_WEBSOCKET_URL);
    const newSocket = io(import.meta.env.VITE_APP_WEBSOCKET_URL, {
      transports: ["websocket"],
      auth: { username },
    });

    setSocket(newSocket);

    const heartbeatInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("ping");

        const timeout = setTimeout(() => {
          console.error("No pong received, disconnecting...");
          newSocket.disconnect();
        }, 5000);

        newSocket.once("pong", () => {
          clearTimeout(timeout);
        });
      }
    }, 10000);

    return () => {
      clearInterval(heartbeatInterval);
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
