// components/livestream/StreamNavbar/StreamNavbar.jsx
import { useState, useEffect } from "react";
import { useStream } from "../../../context/StreamContext"; 
import { useTheme } from "../../../ThemeContext"; 
import { useAuth } from "../../../context/AuthContext";
import StreamStatusIndicator from "./StreamStatusIndicator";
import StreamControls from "./StreamControls";
import StreamNotifications from "./StreamNotifications";
import StreamAnalytics  from "./StreamAnalytics";
import ProfileDropdown from "../../common/ProfileDropdown";
import "./StreamNavbar.css";

function StreamNavbar({ streamId, onLogout }) {
  const { theme } = useTheme();
  const { stream, streamStatus, viewers, userRole, startStream, endStream } =
    useStream();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // This would come from WebSocket in real implementation
    setNotifications([
      {
        id: 1,
        type: "follower",
        user: "John Doe",
        timestamp: new Date(),
        read: false,
      },
      {
        id: 2,
        type: "donation",
        user: "Jane Smith",
        amount: 10,
        timestamp: new Date(),
        read: false,
      },
      {
        id: 3,
        type: "raid",
        user: "StreamTeam",
        viewers: 25,
        timestamp: new Date(),
        read: true,
      },
    ]);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <nav className="stream-navbar" data-theme={theme}>
      <div className="stream-navbar-container">
        {/* Left Section - Stream Identity */}
        <div className="stream-navbar-left">
          <div className="stream-brand">
            <span className="stream-logo">🎥</span>
            <span className="stream-app-name">IGSSAX Live</span>
          </div>

          <StreamStatusIndicator status={streamStatus} viewers={viewers} />
        </div>

        {/* Center Section - Stream Controls */}
        <div className="stream-navbar-center">
          <StreamControls
            streamStatus={streamStatus}
            onStartStream={startStream}
            onEndStream={endStream}
            userRole={userRole}
            streamId={streamId}
          />
        </div>

        {/* Right Section - Streamer Tools */}
        <div className="stream-navbar-right">
          <StreamAnalytics
            viewers={viewers}
            streamStatus={streamStatus}
            userRole={userRole}
          />

          <StreamNotifications
            notifications={notifications}
            unreadCount={unreadNotifications}
            userRole={userRole}
          />

          <ProfileDropdown
            user={currentUser}
            onLogout={onLogout}
            streamMode={true}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="stream-navbar-mobile-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className="navbar-toggle-icon"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="stream-navbar-mobile-menu">
          <StreamControls
            streamStatus={streamStatus}
            onStartStream={startStream}
            onEndStream={endStream}
            userRole={userRole}
            mobile={true}
          />
        </div>
      )}
    </nav>
  );
}

export default StreamNavbar;
