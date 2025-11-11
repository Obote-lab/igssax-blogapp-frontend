import { useState, useRef, useEffect } from "react";
import {
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaFlag,
  FaCheckCircle,
  FaCrown,
  FaUserPlus,
  FaBell,
  FaShare,
  FaCopy,
  FaLink,
  FaBookmark,
  FaVolumeMute,
  FaBan,
  FaEye,
  FaEyeSlash,
  FaReply,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import CommentAvatar from "../CommentAvatar";
import { useTheme } from "../../../../../ThemeContext";

// Utility: relative time with combined units
function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];

  let remaining = seconds;
  let parts = [];

  for (const interval of intervals) {
    const count = Math.floor(remaining / interval.seconds);
    if (count > 0) {
      parts.push(`${count}${interval.label}`);
      remaining -= count * interval.seconds;
    }
    if (parts.length >= 2) break; 
  }

  return parts.length ? parts.join(" ") + " ago" : "just now";
}

function CommentHeader({
  comment,
  formatDate,
  isOriginalPoster = false,
  isVerified = false,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "dark-mode";
  const [menuOpen, setMenuOpen] = useState(false);
  const [followMenuOpen, setFollowMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const followRef = useRef(null);

  const themeColor = "#73c2be" ;
  const textColor = isDark ? "#eaeaea" : "#222";
  const mutedColor = isDark ? "#aaa" : "#666";
  const menuBg = isDark ? "#222" : "#fff";
  const menuBorder = isDark ? "#333" : "#ddd";

  const authorName = `${comment.author?.first_name || ""} ${
    comment.author?.last_name || ""
  }`.trim();
  const relativeTime = timeAgo(comment.created_at);
  const absoluteTime = formatDate
    ? formatDate(comment.created_at)
    : new Date(comment.created_at).toLocaleDateString();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (followRef.current && !followRef.current.contains(event.target)) {
        setFollowMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menu items organized into 3 columns
  const menuColumns = [
    [
      // Column 1: Comment Actions
      { icon: <FaEdit />, text: "Edit", color: themeColor },
      { icon: <FaReply />, text: "Reply", color: "#17a2b8" },
      { icon: <FaHeart />, text: "Like", color: "#dc3545" },
      { icon: <FaShare />, text: "Share", color: "#28a745" },
    ],
    [
      // Column 2: Content Actions
      { icon: <FaCopy />, text: "Copy Text", color: "#6c757d" },
      { icon: <FaLink />, text: "Copy Link", color: "#6c757d" },
      { icon: <FaBookmark />, text: "Save", color: "#ffc107" },
      { icon: <FaFlag />, text: "Report", color: "#fd7e14" },
    ],
    [
      // Column 3: User Actions
      { icon: <FaEye />, text: "Hide Posts", color: "#6c757d" },
      { icon: <FaVolumeMute />, text: "Mute User", color: "#fd7e14" },
      { icon: <FaBan />, text: "Block", color: "#dc3545" },
      { icon: <FaUserPlus />, text: "Follow", color: themeColor },
    ],
  ];

  return (
    <div className="d-flex align-items-start gap-3 mb-3 position-relative">
      {/* Avatar with theme border only */}
      <div
        style={{
          border: `2px solid ${themeColor}`,
          borderRadius: "50%",
        }}
      >
        <CommentAvatar user={comment.author} size="sm" />
      </div>

      {/* Author Info */}
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
          <span
            className="fw-bold"
            style={{ fontSize: "0.95rem", color: textColor }}
          >
            {authorName || "Unknown User"}
          </span>
          {isVerified && (
            <FaCheckCircle
              style={{ color: themeColor, fontSize: "0.8rem" }}
              title="Verified User"
            />
          )}
          {isOriginalPoster && (
            <FaCrown
              style={{ color: "#ffd700", fontSize: "0.8rem" }}
              title="Original Poster"
            />
          )}

          {/* Follow Button with Dropdown */}
          <div ref={followRef} className="position-relative">
            <button
              onClick={() => setFollowMenuOpen(!followMenuOpen)}
              className="btn btn-sm px-2 py-1"
              style={{
                fontSize: "0.7rem",
                backgroundColor: themeColor,
                color: "themeColor",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
              }}
            >
              Follow
            </button>

            {followMenuOpen && (
              <div
                className="position-absolute shadow-sm rounded-2"
                style={{
                  top: "100%",
                  left: 0,
                  backgroundColor: menuBg,
                  border: `1px solid ${menuBorder}`,
                  minWidth: "160px",
                  zIndex: 20,
                  marginTop: "5px",
                }}
              >
                {[
                  {
                    icon: <FaBell />,
                    text: "Notify on posts",
                    color: themeColor,
                  },
                  {
                    icon: <FaUserPlus />,
                    text: "Follow quietly",
                    color: "#6c757d",
                  },
                  {
                    icon: <FaVolumeMute />,
                    text: "Mute user",
                    color: "#dc3545",
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="d-flex align-items-center w-100 px-3 py-2 border-0 bg-transparent"
                    style={{
                      color: textColor,
                      fontSize: "0.8rem",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: item.color, fontSize: "0.75rem" }}>
                      {item.icon}
                    </span>
                    {item.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time - Separated */}
        <div
          className="d-flex align-items-center gap-2"
          style={{ fontSize: "0.8rem" }}
        >
          <span style={{ color: mutedColor, fontWeight: "500" }}>
            {relativeTime}
          </span>
          <span style={{ color: mutedColor, opacity: 0.7 }}>•</span>
          <span
            style={{ color: mutedColor, opacity: 0.8 }}
            title={absoluteTime}
          >
            {absoluteTime}
          </span>
        </div>

        {/* Additional user stats */}
        <div
          className="d-flex align-items-center gap-3 mt-1 flex-wrap"
          style={{ fontSize: "0.75rem" }}
        >
          <span style={{ color: themeColor, fontWeight: "600" }}>
            2.4k followers
          </span>
          <span style={{ color: mutedColor }}>•</span>
          <span style={{ color: mutedColor }}>184 posts</span>
          <span style={{ color: mutedColor }}>•</span>
          <span style={{ color: mutedColor }}>Online</span>
        </div>
      </div>

      {/* Enhanced ⋯ Menu with 3-column layout */}
      <div ref={menuRef} className="position-relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="btn btn-link p-2 border-0"
          style={{
            color: mutedColor,
            fontSize: "14px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? "#333" : "#f8f9fa";
            e.target.style.color = themeColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = mutedColor;
          }}
        >
          <FaEllipsisH />
        </button>

        {menuOpen && (
          <div
            className="position-absolute shadow-lg rounded-3 border-0"
            style={{
              top: "110%",
              right: 0,
              backgroundColor: menuBg,
              border: `1px solid ${menuBorder}`,
              minWidth: "320px",
              maxWidth: "90vw",
              width: "auto",
              zIndex: 10,
              padding: "12px",
            }}
          >
            {/* 3-column grid layout */}
            <div className="row g-2">
              {menuColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="col-4">
                  {column.map((item, index) => (
                    <button
                      key={index}
                      className="d-flex align-items-center w-100 px-2 py-2 border-0 bg-transparent rounded-2"
                      style={{
                        color: textColor,
                        fontSize: "0.8rem",
                        gap: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          color: item.color,
                          fontSize: "0.75rem",
                          minWidth: "16px",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Quick actions footer */}
            <div
              className="mt-3 pt-2 border-top"
              style={{ borderColor: `${menuBorder} !important` }}
            >
              <div className="row g-1">
                <div className="col-6">
                  <button
                    className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                    style={{
                      backgroundColor: themeColor,
                      color: "white",
                      fontSize: "0.7rem",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 8px",
                    }}
                  >
                    <FaRegHeart size={10} />
                    Like
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                    style={{
                      backgroundColor: "transparent",
                      color: textColor,
                      fontSize: "0.7rem",
                      border: `1px solid ${menuBorder}`,
                      borderRadius: "6px",
                      padding: "4px 8px",
                    }}
                  >
                    <FaReply size={10} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .menu-columns {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .author-stats span {
            font-size: 0.7rem !important;
          }
          .menu-container {
            min-width: 280px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CommentHeader;

