import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5002');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join', user._id);
      });

      newSocket.on('riskAlert', (data) => {
        toast.warning(data.message, { 
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          icon: data.level === 'HIGH' ? "🚨" : "⚠️"
        });
      });

      newSocket.on('payoutTriggered', (data) => {
        toast.success(data.message, {
          position: "bottom-center",
          autoClose: 10000,
          theme: "dark",
          icon: "💳"
        });
      });

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
