import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaBookmark,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaGlobe,
  FaPen,
  FaUserFriends,
  FaStore,
  FaBell,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./ProfileDropdown.css";

export default function ProfileDropdown({
  user,
  onLogout,
  toggleDarkMode,
  darkMode,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Avatar / Trigger */}
      <div
        className="d-flex align-items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img
          src={user?.avatar || "https://via.placeholder.com/40"}
          alt="avatar"
          className="rounded-circle me-2"
          width={40}
          height={40}
        />
        <span className="text-white fw-semibold">
          {user?.username || "User"}
        </span>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="dropdown-menu show p-0 shadow-lg rounded-3"
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              width: "350px",
              zIndex: 2000,
            }}
          >
            {/* User Info */}
            <div className="border-bottom p-3 d-flex align-items-center">
              <img
                src={user?.avatar || "https://via.placeholder.com/50"}
                alt="avatar"
                className="rounded-circle me-3"
                width={50}
                height={50}
              />
              <div>
                <h6 className="mb-0">{user?.username || "Guest User"}</h6>
                <small className="text-muted">
                  {user?.email || "No email"}
                </small>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="d-flex justify-content-around border-bottom py-2">
              <Link
                to="/create"
                className="text-center text-decoration-none text-dark small"
              >
                <FaPen size={18} className="mb-1" />
                <div>Create</div>
              </Link>
              <Link
                to="/groups"
                className="text-center text-decoration-none text-dark small"
              >
                <FaUserFriends size={18} className="mb-1" />
                <div>Groups</div>
              </Link>
              <Link
                to="/marketplace"
                className="text-center text-decoration-none text-dark small"
              >
                <FaStore size={18} className="mb-1" />
                <div>Market</div>
              </Link>
              <Link
                to="/notifications"
                className="text-center text-decoration-none text-dark small position-relative"
              >
                <FaBell size={18} className="mb-1" />
                <div>Alerts</div>
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  5
                </span>
              </Link>
            </div>

            {/* Multi-column Sections (Bootstrap responsive grid) */}
            <div className="container-fluid py-3">
              <div className="row">
                {/* Column 1 */}
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <h6 className="text-muted small">Account</h6>
                  <Link className="dropdown-item px-0" to="/profile/me">
                    <FaUser className="me-2" /> Profile
                  </Link>
                  <Link className="dropdown-item px-0" to="/settings">
                    <FaCog className="me-2" /> Settings
                  </Link>
                  <Link
                    className="dropdown-item px-0 d-flex justify-content-between align-items-center"
                    to="/saved"
                  >
                    <span>
                      <FaBookmark className="me-2" /> Saved
                    </span>
                    <span className="badge bg-primary rounded-pill">3</span>
                  </Link>
                </div>

                {/* Column 2 */}
                <div className="col-12 col-md-6">
                  <h6 className="text-muted small">Tools</h6>
                  <button
                    className="dropdown-item px-0"
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? (
                      <FaSun className="me-2" />
                    ) : (
                      <FaMoon className="me-2" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <Link className="dropdown-item px-0" to="/language">
                    <FaGlobe className="me-2" /> Language
                  </Link>
                  <button
                    className="dropdown-item px-0 text-danger"
                    onClick={onLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
