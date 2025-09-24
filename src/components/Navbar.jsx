import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { usersAPI } from "../api/axios";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";

function Navbar({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getMe();
      console.log("User data received:", res.data); // Debug log
      console.log("Avatar URL:", res.data.profile?.avatar); // Debug log
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Function to get the full avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) {
      return "https://via.placeholder.com/40"; // Default placeholder
    }

    // If it's already a full URL, return as is
    if (avatarPath.startsWith("http")) {
      return avatarPath;
    }

    // If it's a relative path, construct the full URL
    return `http://localhost:8000${avatarPath}`;
  };

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top px-3 bg-custom-nav">
        <div className="container-fluid">
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top px-3 bg-custom-nav">
      <div className="container-fluid flex-column flex-md-row">
        {/* Row 1: Logo + Search */}
        <div className="d-flex w-100 justify-content-between align-items-center mb-2 mb-md-0">
          <Link
            to="/dashboard"
            className="fw-bold fs-4 text-decoration-none text-white"
          >
            IGSSAX
          </Link>

          <div className="position-relative d-none d-md-block">
            <input
              type="text"
              placeholder="Search IGSSAX"
              className="form-control rounded-pill ps-5"
              style={{ width: "260px" }}
            />
            <FaSearch
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              size={16}
            />
          </div>

          <button className="btn d-md-none text-white">
            <FaBars size={22} />
          </button>
        </div>

        {/* Row 2: Icons */}
        <div
          className="d-flex justify-content-around align-items-center w-100 my-2 my-md-0"
          style={{ maxWidth: "500px" }}
        >
          <Link to="/dashboard" className="text-white nav-icon">
            <FaHome size={22} />
          </Link>
          <Link to="/friends" className="text-white nav-icon">
            <FaUserFriends size={22} />
          </Link>
          <Link to="/messages" className="text-white nav-icon">
            <FaEnvelope size={22} />
          </Link>
          <Link to="/notifications" className="text-white nav-icon">
            <FaBell size={22} />
          </Link>
          <button className="btn btn-sm btn-light rounded-circle">
            <MdDarkMode size={20} />
          </button>
        </div>

        {/* Row 3: Profile Dropdown */}
        <div className="d-flex w-100 justify-content-end align-items-center mt-2 mt-md-0">
          {user ? (
            <ProfileDropdown
              user={user}
              onLogout={onLogout}
              getAvatarUrl={user.profile.cover_photo}
            />
          ) : (
            <div className="text-white">Not logged in</div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
