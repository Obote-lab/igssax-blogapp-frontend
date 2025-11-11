import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaBlog,
  FaCompass,
  FaFire,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../ThemeContext";

function Navbar({ onLogout }) {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close mobile overlays on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-custom-nav">
        <div className="container-fluid text-white">Loading...</div>
      </nav>
    );
  }

  const themeBgClass =
    theme === "dark" ? "bg-custom-nav-dark" : "bg-custom-nav-light";
  const smallSearchSubmit = (e) => {
    e.preventDefault();
    // wire to your search handling
    alert(`Search: ${searchQuery}`);
    setMobileSearchOpen(false);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg shadow-sm sticky-top ${themeBgClass}`}
        data-theme={theme}
      >
        <div className="container-fluid align-items-center justify-content-between">
          {/* Left area (desktop: logo + search) */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/dashboard"
              className="fw-bold fs-3 text-decoration-none text-white logo-link"
            >
              IGSSAX
            </Link>

            {/* Desktop search only */}
            <div className="navbar-search d-none d-lg-block" role="search">
              <FaSearch className="navbar-search-icon" />
              <input
                aria-label="Search IGSSAX"
                type="text"
                placeholder="Search IGSSAX"
                className="navbar-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Center navigation (hidden on small screens) */}
          <div className="navbar-center d-none d-lg-flex gap-4 align-items-center">
            <Link
              to="/dashboard"
              className={`nav-icon ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
              title="Home"
            >
              <FaHome size={20} />
            </Link>
            <Link
              to="/friends"
              className={`nav-icon ${
                location.pathname === "/friends" ? "active" : ""
              }`}
              title="Friends"
            >
              <FaUserFriends size={20} />
            </Link>
            <Link
              to="/messages"
              className={`nav-icon ${
                location.pathname === "/messages" ? "active" : ""
              }`}
              title="Messages"
            >
              <FaEnvelope size={20} />
            </Link>
            <Link
              to="/notifications"
              className={`nav-icon ${
                location.pathname === "/notifications" ? "active" : ""
              }`}
              title="Notifications"
            >
              <FaBell size={20} />
            </Link>

            {/* Blog/Discover/Trending */}
            <Link
              to="/blog"
              className={`nav-icon ${
                location.pathname === "/blog" ? "active" : ""
              }`}
              title="Blog"
            >
              <FaBlog size={20} />
            </Link>
            <Link
              to="/discover"
              className={`nav-icon ${
                location.pathname === "/discover" ? "active" : ""
              }`}
              title="Discover"
            >
              <FaCompass size={20} />
            </Link>
            <Link
              to="/trending"
              className={`nav-icon ${
                location.pathname === "/trending" ? "active" : ""
              }`}
              title="Trending"
            >
              <FaFire size={20} />
            </Link>
          </div>

          {/* Right side (profile + mobile toggles) */}
          <div className="d-flex align-items-center gap-2">
            {/* On larger screens show profile dropdown normally */}
            <div className="d-none d-lg-flex align-items-center">
              {isAuthenticated ? (
                <div className="profile-wrapper">
                  <ProfileDropdown user={currentUser} onLogout={onLogout} />
                </div>
              ) : (
                <div className="text-white small">Not logged in</div>
              )}
            </div>

            {/* Mobile actions: search toggle + menu toggle */}
            <div className="d-flex d-lg-none align-items-center gap-1">
              <button
                aria-label={mobileSearchOpen ? "Close search" : "Open search"}
                className="btn btn-ghost text-white mobile-icon-btn"
                onClick={() => setMobileSearchOpen((s) => !s)}
                title="Search"
              >
                <FaSearch size={18} />
              </button>
              <button
                aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                className="btn btn-ghost text-white mobile-icon-btn"
                onClick={() => setShowMobileMenu((s) => !s)}
                title="Menu"
              >
                {showMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: expanded search row */}
        {mobileSearchOpen && (
          <div
            className={`mobile-search-row ${
              theme === "dark" ? "mobile-row-dark" : "mobile-row-light"
            } d-lg-none`}
          >
            <form className="w-100 d-flex gap-2" onSubmit={smallSearchSubmit}>
              <input
                aria-label="Mobile search"
                className="form-control mobile-search-input"
                placeholder="Search IGSSAX"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Go
              </button>
            </form>
          </div>
        )}

        {/* Mobile: expanded menu panel */}
        {showMobileMenu && (
          <div
            className={`mobile-menu-panel ${
              theme === "dark" ? "mobile-row-dark" : "mobile-row-light"
            } d-lg-none`}
          >
            <div className="d-flex flex-column py-2">
              <Link className="mobile-link py-2" to="/dashboard">
                Home
              </Link>
              <Link className="mobile-link py-2" to="/friends">
                Friends
              </Link>
              <Link className="mobile-link py-2" to="/messages">
                Messages
              </Link>
              <Link className="mobile-link py-2" to="/notifications">
                Notifications
              </Link>
              <hr className="mobile-sep" />
              <Link className="mobile-link py-2" to="/blog">
                Blog
              </Link>
              <Link className="mobile-link py-2" to="/discover">
                Discover
              </Link>
              <Link className="mobile-link py-2" to="/trending">
                Trending
              </Link>
              <div className="py-2">
                {isAuthenticated ? (
                  <ProfileDropdown
                    user={currentUser}
                    onLogout={onLogout}
                    mobile
                  />
                ) : (
                  <Link to="/login">Log in</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav (always visible on phones) */}
      <div
        className={`d-lg-none fixed-bottom mobile-bottom-nav ${
          theme === "dark" ? "mobile-bottom-dark" : "mobile-bottom-light"
        }`}
      >
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-around align-items-center py-2">
            <Link to="/dashboard" className="bottom-icon" title="Home">
              <FaHome size={18} />
            </Link>
            <Link to="/friends" className="bottom-icon" title="Friends">
              <FaUserFriends size={18} />
            </Link>
            <Link to="/messages" className="bottom-icon" title="Messages">
              <FaEnvelope size={18} />
            </Link>
            <Link
              to="/notifications"
              className="bottom-icon"
              title="Notifications"
            >
              <FaBell size={18} />
            </Link>

            {/* Profile small avatar to the right */}
            <div className="bottom-icon">
              {isAuthenticated ? (
                <ProfileDropdown
                  user={currentUser}
                  onLogout={onLogout}
                  mobile
                />
              ) : (
                <Link to="/login" className="text-white">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
