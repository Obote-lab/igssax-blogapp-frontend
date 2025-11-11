// components/livestream/StreamNavbar/StreamNotifications.jsx
import { FaBell } from "react-icons/fa";
function StreamNotifications({ notifications, unreadCount, userRole }) {
  return (
    <div className="stream-notifications">
      <button className="notification-bell btn btn-outline-accent btn-sm position-relative">
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}

export default StreamNotifications; 
