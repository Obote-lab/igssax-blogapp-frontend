// components/common/ProfileDropdown.jsx
import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaVideo,
  FaHistory,
  FaBookmark,
  FaCrown,
  FaChevronDown,
  FaCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function ProfileDropdown({
  user,
  onLogout,
  mobile = false,
  streamMode = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
  };

  // Streamer-specific menu items
  const streamerMenuItems = [
    {
      icon: <FaVideo className="me-2" />,
      label: "My Streams",
      path: "/live/mystreams",
    },
    {
      icon: <FaCrown className="me-2" />,
      label: "Channel Dashboard",
      path: "/live/dashboard",
    },
    {
      icon: <FaHistory className="me-2" />,
      label: "Stream Analytics",
      path: "/live/analytics",
    },
  ];

  // Regular menu items
  const regularMenuItems = [
    { icon: <FaUser className="me-2" />, label: "Profile", path: "/profile" },
    { icon: <FaBookmark className="me-2" />, label: "Saved", path: "/saved" },
    {
      icon: <FaBell className="me-2" />,
      label: "Notifications",
      path: "/notifications",
    },
    { icon: <FaCog className="me-2" />, label: "Settings", path: "/settings" },
  ];

  const allMenuItems = streamMode
    ? [...streamerMenuItems, ...regularMenuItems]
    : regularMenuItems;

  // Mobile version - simplified
  if (mobile) {
    return (
      <div className="dropdown-center">
        <button
          className="btn btn-link text-white p-0 text-decoration-none d-flex align-items-center"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <FaUser size={16} />
          </div>
        </button>

        <ul
          className={`dropdown-menu ${
            showDropdown ? "show" : ""
          } position-absolute`}
        >
          <li>
            <div className="dropdown-header text-dark">
              <div className="fw-bold">
                {user?.first_name} {user?.last_name}
              </div>
              <small className="text-muted">@{user?.username}</small>
            </div>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          {allMenuItems.slice(0, 3).map((item, index) => (
            <li key={index}>
              <Link
                className="dropdown-item d-flex align-items-center"
                to={item.path}
                onClick={() => setShowDropdown(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button
              className="dropdown-item d-flex align-items-center text-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }

  // Desktop version - full dropdown
  return (
    <div className="dropdown-center" ref={dropdownRef}>
      <button
        className="btn btn-outline-light border-0 d-flex align-items-center gap-2"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {/* User Avatar */}
        <div className="position-relative">
          {user?.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={user.first_name}
              className="rounded-circle"
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center text-primary"
              style={{ width: "32px", height: "32px" }}
            >
              <FaUser size={16} />
            </div>
          )}

          {/* Online Status Indicator */}
          <FaCircle
            className="position-absolute bottom-0 end-0 text-success"
            style={{ fontSize: "8px" }}
          />
        </div>

        {/* User Name (hidden on smaller screens) */}
        <span className="d-none d-md-inline text-white">
          {user?.first_name} {user?.last_name}
        </span>

        <FaChevronDown
          size={12}
          className={`text-white-50 transition-all ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`dropdown-menu ${
          showDropdown ? "show" : ""
        } shadow border-0 p-2`}
        style={{ minWidth: "250px" }}
      >
        {/* User Header */}
        <div className="d-flex align-items-center gap-3 p-3 border-bottom">
          {user?.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={user.first_name}
              className="rounded-circle"
              style={{ width: "48px", height: "48px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center text-primary"
              style={{ width: "48px", height: "48px" }}
            >
              <FaUser size={20} />
            </div>
          )}

          <div className="flex-grow-1">
            <div className="fw-bold text-dark mb-1">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-muted small">
              @{user?.username || user?.first_name?.toLowerCase()}
            </div>
            <div className="d-flex align-items-center gap-1 mt-1">
              <FaCircle className="text-success" style={{ fontSize: "6px" }} />
              <small className="text-success">Online</small>
            </div>
          </div>
        </div>

        {/* Streamer Stats (if in stream mode) */}
        {streamMode && (
          <div className="p-3 bg-light bg-opacity-50 rounded my-2">
            <div className="row text-center g-2">
              <div className="col-4">
                <div className="fw-bold text-dark">1.2K</div>
                <small className="text-muted">Followers</small>
              </div>
              <div className="col-4">
                <div className="fw-bold text-dark">45</div>
                <small className="text-muted">Streams</small>
              </div>
              <div className="col-4">
                <div className="fw-bold text-dark">12</div>
                <small className="text-muted">Subs</small>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="p-1">
          {allMenuItems.map((item, index) => (
            <Link
              key={index}
              className="dropdown-item rounded d-flex align-items-center py-2 px-3 text-dark text-decoration-none"
              to={item.path}
              onClick={() => setShowDropdown(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <hr className="my-2" />

        {/* Logout Button */}
        <div className="p-1">
          <button
            className="dropdown-item rounded d-flex align-items-center py-2 px-3 text-danger text-decoration-none w-100 border-0 bg-transparent"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </div>

        {/* Footer Status */}
        <div className="px-3 py-2 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Status</small>
            <div className="d-flex align-items-center gap-1">
              <FaCircle className="text-success" style={{ fontSize: "6px" }} />
              <small className="text-success">Active</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDropdown;
