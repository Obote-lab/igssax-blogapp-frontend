// src/components/ProfileDropdown.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaBookmark,
  FaMoon,
  FaQuestionCircle,
  FaSignOutAlt,
  FaShieldAlt,
  FaGlobe,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { ThemeContext } from "../ThemeContext";

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to get avatar URL with proper fallback
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) {
      return null; // Return null to use fallback icon
    }

    // If it's already a full URL, return as is
    if (avatarPath.startsWith("http")) {
      return avatarPath;
    }

    // If it's a relative path, construct the full URL
    return `http://127.0.0.1:8000${avatarPath}`;
  };

  const avatarUrl = getAvatarUrl(user?.profile?.avatar);

  // Handle image error - fixed syntax
  const handleImageError = (e) => {
    e.target.style.display = "none";
    // Safely check and show fallback icon
    const sibling = e.target.nextElementSibling;
    if (sibling) {
      sibling.style.display = "flex";
    }
  };

  // Handle dropdown image error - fixed syntax
  const handleDropdownImageError = (e) => {
    e.target.style.display = "none";
    // Safely check and show fallback icon
    const sibling = e.target.nextElementSibling;
    if (sibling) {
      sibling.style.display = "flex";
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="btn d-flex align-items-center gap-2 border-0 bg-transparent text-white"
      >
        {avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="profile"
              className="rounded-circle border border-2 border-white"
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
              onError={handleImageError}
            />
            {/* Fallback icon - hidden by default */}
            <div
              className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center d-none"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255,255,255,0.2)",
                position: "absolute",
              }}
            >
              <FaUserCircle size={24} className="text-white" />
            </div>
          </>
        ) : (
          <div
            className="rounded-circle border border-2 border-white d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <FaUserCircle size={24} className="text-white" />
          </div>
        )}
        <span className="fw-medium d-none d-md-inline">
          {user?.first_name || "Guest"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="dropdown-menu dropdown-menu-end show mt-2 shadow rounded-3 p-2"
          style={{ position: "absolute", right: 0, minWidth: "260px" }}
        >
          {/* Top: Profile quick link */}
          <div className="d-flex align-items-center p-2 mb-2 rounded-3 bg-light">
            {avatarUrl ? (
              <>
                <img
                  src={avatarUrl}
                  alt="profile"
                  className="rounded-circle me-2"
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                  onError={handleDropdownImageError}
                />
                {/* Fallback icon for dropdown */}
                <div
                  className="rounded-circle me-2 d-flex align-items-center justify-content-center d-none"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#667eea",
                    color: "white",
                    position: "absolute",
                  }}
                >
                  <FaUserCircle size={28} />
                </div>
              </>
            ) : (
              <div
                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#73c2be",
                  color: "white",
                }}
              >
                <FaUserCircle size={28} />
              </div>
            )}
            <div>
              <Link
                to="/profile/me"
                className="fw-bold text-dark text-decoration-none"
                onClick={() => setOpen(false)}
              >
                {user?.first_name} {user?.last_name}
              </Link>
              <p className="text-muted small mb-0">{user?.email}</p>
            </div>
          </div>

          <hr className="my-2" />

          {/* Quick links */}
          <ul className="list-unstyled mb-2">
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/profile/me"
                onClick={() => setOpen(false)}
              >
                <FaUser /> My Profile
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/saved"
                onClick={() => setOpen(false)}
              >
                <FaBookmark /> Saved
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/settings"
                onClick={() => setOpen(false)}
              >
                <FaCog /> Settings
              </Link>
            </li>
          </ul>

          <hr className="my-2" />

          {/* Tools */}
          <ul className="list-unstyled mb-2">
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={toggleDarkMode}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/privacy"
                onClick={() => setOpen(false)}
              >
                <FaShieldAlt /> Privacy
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/help"
                onClick={() => setOpen(false)}
              >
                <FaQuestionCircle /> Help & Support
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/language"
                onClick={() => setOpen(false)}
              >
                <FaGlobe /> Language
              </Link>
            </li>
          </ul>

          <hr className="my-2" />

          {/* Logout */}
          <div className="text-center">
            <button
              className="btn btn-sm btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={onLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
