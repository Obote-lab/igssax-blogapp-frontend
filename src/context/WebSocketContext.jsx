import React, { createContext, useContext, useEffect, useState } from "react";
import { notificationsWebSocket, livestreamWebSocket } from "../api/axios";

const WebSocketContext = createContext();

export const useWebSockets = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [notificationSocket, setNotificationSocket] = useState(null);
  const [streamSocket, setStreamSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("access");

    if (!userId || !token) return;

    // Connect Notifications WebSocket
    const notifSocket = notificationsWebSocket.connect(userId);

    notifSocket.onopen = () => {
      console.log("Notifications WebSocket connected");
      setIsConnected(true);
    };

    notifSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("New notification:", data);

      // Add new notification to state
      setNotifications((prev) => [data.content, ...prev]);
    };

    notifSocket.onclose = () => {
      console.warn("Notifications WebSocket disconnected");
      setIsConnected(false);
    };

    setNotificationSocket(notifSocket);

    // Cleanup on unmount
    return () => notifSocket.close();
  }, []);

  const connectStream = (streamId) => {
    const ws = livestreamWebSocket.connect(streamId);
    setStreamSocket(ws);
    return ws;
  };

  const value = {
    notificationSocket,
    streamSocket,
    notifications,
    connectStream,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
