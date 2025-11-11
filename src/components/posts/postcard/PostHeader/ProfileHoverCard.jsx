import React, { useState } from "react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaUserFriends,
  FaCommentDots,
  FaUserPlus,
  FaUserCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext"; 

const APP_THEME_COLOR = "#73c2be";

function ProfileHoverCard({ author }) {
  if (!author) return null;

  const { theme, highContrast, colorBlindMode, reducedMotion } = useTheme();

  const isDark = theme === "dark" || theme === "dark-mode";
  const [isFollowing, setIsFollowing] = useState(false);

  const avatarUrl = author?.profile?.avatar;
  const mutuals = author?.profile?.mutual_friends || [];
  const recentActivity = author?.profile?.recent_activity || "";

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  // Decide border + glow color based on theme and accessibility
  let borderColor = APP_THEME_COLOR;
  let glowColor = APP_THEME_COLOR;

  if (highContrast) {
    borderColor = isDark ? "#fff" : "#000";
    glowColor = borderColor;
  }

  if (colorBlindMode) {
    borderColor = "#0077cc"; 
    glowColor = "#ff9900";
  }

  return (
    <div
      className="position-absolute shadow-lg rounded-4 overflow-hidden"
      style={{
        top: "60px",
        left: 0,
        zIndex: 1000,
        width: "300px",
        background: isDark ? "#1e1e1e" : "#fff",
        border: `1px solid ${isDark ? "#333" : "#eee"}`,
        animation: reducedMotion ? "none" : "fadeInUp 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center p-3 pb-2">
        <img
          src={
            avatarUrl ||
            `https://ui-avatars.com/api/?name=${author?.first_name}+${author?.last_name}&background=73c2be&color=fff&size=64`
          }
          alt={`${author?.first_name} ${author?.last_name}`}
          className="rounded-circle shadow-sm me-3 avatar-glow"
          width={64}
          height={64}
          style={{
            border: `3px solid ${borderColor}`,
            boxShadow: `0 0 8px ${glowColor}55`,
            animation: reducedMotion ? "none" : "pulseGlow 2s infinite",
          }}
        />
        <div>
          <div
            className="fw-bold"
            style={{ color: isDark ? "#f0f0f0" : "#222" }}
          >
            {author?.first_name} {author?.last_name}
            {author?.is_verified && (
              <FaCheckCircle
                className="ms-1"
                style={{ color: APP_THEME_COLOR }}
              />
            )}
          </div>
          <small
            className="text-muted"
            style={{ color: isDark ? "#aaa" : "#666" }}
          >
            {author?.profile?.headline || "No headline available"}
          </small>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity && (
        <div
          className="px-3 pb-2 small"
          style={{ color: isDark ? "#bbb" : "#666" }}
        >
          <em>{recentActivity}</em>
        </div>
      )}

      {/* Mutual Friends */}
      {mutuals.length > 0 && (
        <div
          className="px-3 pb-2 small d-flex align-items-center"
          style={{ color: isDark ? "#bbb" : "#666" }}
        >
          <FaUserFriends className="me-1" />
          {mutuals.length} mutual friend{mutuals.length > 1 ? "s" : ""}{" "}
          including <strong>{mutuals.slice(0, 2).join(", ")}</strong>
        </div>
      )}

      {/* Bio Info */}
      <div
        className="px-3 pb-2 small"
        style={{ color: isDark ? "#bbb" : "#666" }}
      >
        {author?.profile?.location && (
          <div className="d-flex align-items-center gap-1">
            <FaMapMarkerAlt size={12} /> {author.profile.location}
          </div>
        )}
        {author?.profile?.work && (
          <div className="d-flex align-items-center gap-1">
            <FaBriefcase size={12} /> {author.profile.work}
          </div>
        )}
        {author?.profile?.education && (
          <div className="d-flex align-items-center gap-1">
            <FaGraduationCap size={12} /> {author.profile.education}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div
        className="d-flex justify-content-around py-2 border-top"
        style={{ borderColor: isDark ? "#333" : "#eee" }}
      >
        <div className="text-center">
          <strong style={{ color: APP_THEME_COLOR }}>
            {author?.profile?.friends_count || 0}
          </strong>
          <div className="small" style={{ color: isDark ? "#bbb" : "#666" }}>
            Friends
          </div>
        </div>
        <div className="text-center">
          <strong style={{ color: APP_THEME_COLOR }}>
            {author?.profile?.posts_count || 0}
          </strong>
          <div className="small" style={{ color: isDark ? "#bbb" : "#666" }}>
            Posts
          </div>
        </div>
        <div className="text-center">
          <strong style={{ color: APP_THEME_COLOR }}>
            {author?.profile?.followers_count || 0}
          </strong>
          <div className="small" style={{ color: isDark ? "#bbb" : "#666" }}>
            Followers
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 px-3 pb-3">
        <button
          className="btn btn-sm flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2"
          style={{
            background: APP_THEME_COLOR,
            color: "#fff",
            borderRadius: "20px",
          }}
        >
          <FaUserFriends /> Friends
        </button>
        <button
          className="btn btn-sm flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2"
          style={{
            background: isDark ? "#333" : "#f8f9fa",
            color: isDark ? "#eee" : "#333",
            borderRadius: "20px",
          }}
        >
          <FaCommentDots /> Message
        </button>
      </div>

      {/* Follow + View Profile */}
      <div className="d-flex justify-content-between align-items-center px-3 pb-3">
        <button
          className="btn btn-sm fw-semibold d-flex align-items-center gap-2"
          onClick={handleFollowToggle}
          style={{
            background: isFollowing
              ? isDark
                ? "#264d4b"
                : "#e0f7f5"
              : isDark
              ? "#333"
              : "#f0f0f0",
            color: isFollowing ? APP_THEME_COLOR : isDark ? "#eee" : "#555",
            borderRadius: "20px",
            padding: "4px 12px",
          }}
        >
          {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
          {isFollowing ? "Following" : "Follow"}
        </button>

        <Link
          to={`/profile/${author?.id}`}
          className="text-decoration-none small fw-semibold d-flex align-items-center gap-1"
          style={{
            color: APP_THEME_COLOR,
          }}
        >
          View Profile <FaExternalLinkAlt size={10} />
        </Link>
      </div>
    </div>
  );
}

export default ProfileHoverCard;
