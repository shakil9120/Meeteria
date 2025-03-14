import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket | null = null;

    if (localStorage.getItem("username")) {
      console.log("connecting to ", import.meta.env.VITE_APP_WEBSOCKET_URL);
      newSocket = io(import.meta.env.VITE_APP_WEBSOCKET_URL, {
        transports: ["websocket"],
        auth: { username: localStorage.getItem("username") },
      });

      setSocket(newSocket);

      const heartbeatInterval = setInterval(() => {
        if (newSocket && newSocket.connected) {
          newSocket.emit('ping');

          const timeout = setTimeout(() => {
            console.error('No pong received, disconnecting...');
            newSocket.disconnect();
          }, 5000); // 5 seconds timeout

          newSocket.once('pong', () => {
            clearTimeout(timeout);
          });
        }
      }, 10000); // Send ping every 10 seconds

      return () => {
        clearInterval(heartbeatInterval);
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
