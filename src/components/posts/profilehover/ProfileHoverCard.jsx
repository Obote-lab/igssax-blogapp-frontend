// src/components/profile/ProfileHoverCard.jsx
import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaUserPlus,
  FaUsers,
  FaUserFriends,
  FaUserCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../../ThemeContext";

function ProfileHoverCard({ author }) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || !author) return null;

  const APP_THEME_COLOR = theme === "dark" ? "#4dd0e1" : "#73c2be";
  const cardBg = theme === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = theme === "dark" ? "#e4e6eb" : "#212529";
  const subTextColor = theme === "dark" ? "#b0b3b8" : "#6c757d";
  const borderColor = theme === "dark" ? "#2e2e2e" : "#dee2e6";
  const glassBg =
    theme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.85)";

  const getUrl = (path) =>
    path?.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;

  const avatarUrl = getUrl(author?.profile?.avatar);

  const stats = [
    {
      label: "Friends",
      count: author?.profile?.friends_count || 0,
      icon: <FaUserFriends />,
      gradient: "linear-gradient(45deg, #4facfe, #00f2fe)",
    },
    {
      label: "Followers",
      count: author?.profile?.followers_count || 0,
      icon: <FaUsers />,
      gradient: "linear-gradient(45deg, #f093fb, #f5576c)",
    },
    {
      label: "Following",
      count: author?.profile?.following_count || 0,
      icon: <FaUserCheck />,
      gradient: "linear-gradient(45deg, #43e97b, #38f9d7)",
    },
  ];

  return (
    <motion.div
      className="profile-hover-card rounded-4 shadow border position-absolute backdrop-blur-md"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        top: "110%",
        left: 0,
        width: "320px",
        zIndex: 1050,
        backgroundColor: glassBg,
        borderColor,
        color: textColor,
        boxShadow:
          theme === "dark"
            ? "0 4px 20px rgba(77,208,225,0.15)"
            : "0 4px 20px rgba(115,194,190,0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Avatar */}
      <motion.div
        className="text-center pt-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.img
          src={
            avatarUrl ||
            `https://ui-avatars.com/api/?name=${author?.first_name}+${
              author?.last_name
            }&background=${APP_THEME_COLOR.replace("#", "")}&color=fff&size=80`
          }
          alt="avatar"
          className="rounded-circle border border-3 border-white shadow"
          width={85}
          height={85}
          style={{
            boxShadow:
              theme === "dark"
                ? "0 0 25px rgba(77,208,225,0.25)"
                : "0 0 20px rgba(115,194,190,0.25)",
            transition: "0.3s all ease",
          }}
          whileHover={{
            boxShadow:
              theme === "dark"
                ? "0 0 35px rgba(77,208,225,0.45)"
                : "0 0 30px rgba(115,194,190,0.45)",
          }}
        />
      </motion.div>

      {/* Info */}
      <div className="text-center px-3 pb-3 mt-3">
        <h6 className="fw-bold mb-1" style={{ fontSize: "1.05rem" }}>
          {author?.first_name} {author?.last_name}
        </h6>
        <p className="small mb-2" style={{ color: subTextColor }}>
          @{author?.username || "username"}
        </p>

        {author?.profile?.bio && (
          <p
            className="small mb-4"
            style={{
              color: subTextColor,
              fontStyle: "italic",
              lineHeight: "1.5",
            }}
          >
            “{author.profile.bio}”
          </p>
        )}

        {/* Stats Section */}
        <div
          className="d-flex justify-content-around text-center mb-4"
          style={{ gap: "5px" }}
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-2 py-1 rounded-3"
              style={{
                cursor: "pointer",
                minWidth: "85px",
                background: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
                transition: "background 0.3s ease",
              }}
            >
              <div
                className="fw-bold"
                style={{
                  background: item.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "1.15rem",
                }}
              >
                {item.count}
              </div>
              <div
                className="small d-flex align-items-center justify-content-center gap-1"
                style={{ color: subTextColor }}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div
          className="small text-start mb-3 px-2"
          style={{ color: subTextColor, lineHeight: "1.6" }}
        >
          {author?.profile?.location && (
            <div className="d-flex align-items-center gap-2">
              <FaMapMarkerAlt size={12} /> {author.profile.location}
            </div>
          )}
          {author?.profile?.work && (
            <div className="d-flex align-items-center gap-2">
              <FaBriefcase size={12} /> {author.profile.work}
            </div>
          )}
          {author?.profile?.education && (
            <div className="d-flex align-items-center gap-2">
              <FaGraduationCap size={12} /> {author.profile.education}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-center gap-2 mt-2">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 12px ${APP_THEME_COLOR}`,
            }}
            transition={{ type: "spring", stiffness: 250 }}
            className="btn btn-sm"
            style={{
              background: APP_THEME_COLOR,
              color: "white",
              fontWeight: 500,
              border: "none",
              borderRadius: "20px",
              padding: "6px 14px",
            }}
          >
            <FaUserPlus className="me-1" /> Add Friend
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`btn btn-sm ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-secondary"
            } rounded-pill`}
            style={{
              padding: "6px 14px",
              fontWeight: 500,
            }}
          >
            <FaUsers className="me-1" /> View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileHoverCard;
