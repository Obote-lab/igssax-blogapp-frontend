import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar({ onLogout }) {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top bg-custom-nav">
        <div className="container-fluid">
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top bg-custom-nav">
        <div className="container-fluid">
          {/* Desktop Layout */}
          <div className="d-none d-lg-flex w-100 align-items-center">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="fw-bold fs-3 text-decoration-none text-white me-4"
            >
              IGSSAX
            </Link>

            {/* Search Bar */}
            <div
              className="position-relative flex-grow-1 mx-4"
              style={{ maxWidth: "600px" }}
            >
              <input
                type="text"
                placeholder="Search IGSSAX"
                className="form-control rounded-pill ps-5 border-0 shadow-sm"
              />
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                size={16}
              />
            </div>

            {/* Navigation Icons */}
            <div className="d-flex align-items-center gap-3">
              <Link
                to="/dashboard"
                className="text-white nav-icon position-relative"
              >
                <FaHome size={22} />
                <div className="nav-tooltip">Home</div>
              </Link>
              <Link
                to="/friends"
                className="text-white nav-icon position-relative"
              >
                <FaUserFriends size={22} />
                <div className="nav-tooltip">Friends</div>
              </Link>
              <Link
                to="/messages"
                className="text-white nav-icon position-relative"
              >
                <FaEnvelope size={22} />
                <div className="nav-tooltip">Messages</div>
              </Link>
              <Link
                to="/notifications"
                className="text-white nav-icon position-relative"
              >
                <FaBell size={22} />
                <div className="nav-tooltip">Notifications</div>
              </Link>
              <button className="btn btn-light rounded-circle p-2 nav-icon">
                <MdDarkMode size={18} />
                <div className="nav-tooltip">Theme</div>
              </button>

              {/* Profile Dropdown */}
              {isAuthenticated ? (
                <ProfileDropdown user={currentUser} onLogout={onLogout} />
              ) : (
                <div className="text-white">Not logged in</div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="d-flex d-lg-none w-100 flex-column">
            {/* Row 1: Logo + Search + Menu */}
            <div className="d-flex w-100 justify-content-between align-items-center mb-2">
              <Link
                to="/dashboard"
                className="fw-bold fs-4 text-decoration-none text-white"
              >
                IGSSAX
              </Link>

              {/* Mobile Search Toggle */}
              <div className="d-flex align-items-center gap-3">
                <button className="btn text-white p-1">
                  <FaSearch size={20} />
                </button>
                <button
                  className="btn text-white p-1"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  {showMobileMenu ? (
                    <FaTimes size={22} />
                  ) : (
                    <FaBars size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Row 2: Search Bar (Visible when toggled) */}
            <div
              className={`w-100 mb-2 ${showMobileMenu ? "d-block" : "d-none"}`}
            >
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="Search IGSSAX"
                  className="form-control rounded-pill ps-5 border-0 shadow-sm"
                />
                <FaSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  size={16}
                />
              </div>
            </div>

            {/* Row 3: Navigation Icons (Visible when menu is open) */}
            <div
              className={`w-100 ${
                showMobileMenu ? "d-flex" : "d-none"
              } justify-content-around align-items-center py-2 border-top border-white border-opacity-25`}
            >
              <Link
                to="/dashboard"
                className="text-white nav-icon-mobile text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaHome size={20} />
                <div className="nav-label">Home</div>
              </Link>
              <Link
                to="/friends"
                className="text-white nav-icon-mobile text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaUserFriends size={20} />
                <div className="nav-label">Friends</div>
              </Link>
              <Link
                to="/messages"
                className="text-white nav-icon-mobile text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaEnvelope size={20} />
                <div className="nav-label">Messages</div>
              </Link>
              <Link
                to="/notifications"
                className="text-white nav-icon-mobile text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaBell size={20} />
                <div className="nav-label">Alerts</div>
              </Link>
              <button className="btn text-white nav-icon-mobile text-center">
                <MdDarkMode size={20} />
                <div className="nav-label">Theme</div>
              </button>

              {/* Mobile Profile */}
              {isAuthenticated && (
                <div className="nav-icon-mobile text-center">
                  <ProfileDropdown
                    user={currentUser}
                    onLogout={onLogout}
                    mobile
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Always visible on mobile) */}
      <div className="d-lg-none fixed-bottom bg-custom-nav border-top border-white border-opacity-25">
        <div className="container-fluid">
          <div className="d-flex justify-content-around align-items-center py-2">
            <Link
              to="/dashboard"
              className="text-white nav-icon-mobile text-center"
            >
              <FaHome size={20} />
              <div className="nav-label">Home</div>
            </Link>
            <Link
              to="/friends"
              className="text-white nav-icon-mobile text-center"
            >
              <FaUserFriends size={20} />
              <div className="nav-label">Friends</div>
            </Link>
            <Link
              to="/messages"
              className="text-white nav-icon-mobile text-center"
            >
              <FaEnvelope size={20} />
              <div className="nav-label">Messages</div>
            </Link>
            <Link
              to="/notifications"
              className="text-white nav-icon-mobile text-center"
            >
              <FaBell size={20} />
              <div className="nav-label">Alerts</div>
            </Link>
            {isAuthenticated && (
              <div className="nav-icon-mobile text-center">
                <ProfileDropdown
                  user={currentUser}
                  onLogout={onLogout}
                  mobile
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
