// src/components/NotificationBell.jsx
import React from "react";
import { useWebSockets } from "../context/WebSocketContext";

const NotificationBell = () => {
  const { notifications, isConnected } = useWebSockets();

  return (
    <div className="notification-bell">
      <i className="fa fa-bell"></i>
      {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}
      {!isConnected && <small>(offline)</small>}
    </div>
  );
};

export default NotificationBell;
