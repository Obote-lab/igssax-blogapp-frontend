// src/components/posts/PostOptionsDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaEllipsisH,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaBellSlash,
  FaEyeSlash,
  FaLink,
  FaShare,
  FaDownload,
  FaCrown,
  FaRocket,
  FaMagic,
  FaShieldAlt,
  FaBan,
  FaExclamationTriangle,
  FaVolumeMute,
  FaFire,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { useAuth } from "../../../../context/AuthContext";
import { useTheme } from "../../../../ThemeContext";

function PostOptionsDropdown({ post, onEdit, onDelete, onReport }) {
  const { currentUser } = useAuth();
  const { theme, fontSize, reducedMotion } = useTheme();
  const [open, setOpen] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [saved, setSaved] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthor = currentUser?.id === post?.author?.id;
  const isPremiumUser = currentUser?.tier === "premium";
  const isDark = theme === "dark" || theme === "dark-mode";

  // Theme-aware styling
  const themeStyles = {
    background: isDark ? "#1a1d23" : "#ffffff",
    surface: isDark ? "#2d323d" : "#f8f9fa",
    text: isDark ? "#e9ecef" : "#212529",
    textMuted: isDark ? "#adb5bd" : "#6c757d",
    border: isDark ? "#495057" : "#dee2e6",
    primary: isDark ? "#73c2be" : "#0d6efd",
    card: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowReportReasons(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
    setShowReportReasons(false);
  };

  // Toast function
  const showToast = (message, type = "info") => {
    console.log(`Toast (${type}): ${message}`);
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/posts/${post?.id}`;
    navigator.clipboard.writeText(postUrl);
    showToast("Post link copied to clipboard!", "success");
    setOpen(false);
  };

  const handleSaveToggle = () => {
    setSaved((prev) => !prev);
    showToast(saved ? "Removed from saved posts" : "Post saved!", "success");
    setOpen(false);
  };

  const handleReport = (reason) => {
    showToast(`Report submitted: ${reason}`, "danger");
    onReport?.(post, reason);
    setShowReportReasons(false);
    setOpen(false);
  };

  // Options for 3 columns
  const engageOptions = [
    {
      icon: saved ? <FaBookmark className="text-warning" /> : <FaRegBookmark />,
      label: saved ? "Unsave Post" : "Save Post",
      action: handleSaveToggle,
      color: saved ? "#ffc107" : themeStyles.text,
    },
    {
      icon: <FaLink />,
      label: "Copy Link",
      action: handleCopyLink,
    },
    {
      icon: <FaShare />,
      label: "Share Post",
      action: () => showToast("Share dialog opened", "info"),
    },
    {
      icon: <FaBellSlash />,
      label: "Mute Notifications",
      action: () => showToast("Notifications muted", "info"),
    },
    {
      icon: <FaEyeSlash />,
      label: "Hide Post",
      action: () => showToast("Post hidden", "warning"),
    },
  ];

  const enhanceOptions = [
    {
      icon: <FaRocket className="text-warning" />,
      label: "Boost Post",
      action: () => showToast("Post boosted!", "premium"),
      premium: true,
    },
    {
      icon: <FaMagic className="text-info" />,
      label: "AI Enhance",
      action: () => showToast("Enhancing post...", "info"),
      premium: true,
    },
    {
      icon: <FaDownload />,
      label: "Export Data",
      action: () => showToast("Exporting data...", "info"),
    },
    {
      icon: <FaCrown className="text-warning" />,
      label: "Pin to Profile",
      action: () => showToast("Post pinned!", "info"),
      premium: true,
    },
  ];

  const safetyOptions = [
    {
      icon: <FaFlag className="text-danger" />,
      label: "Report Post",
      action: () => setShowReportReasons(true),
      danger: true,
    },
    {
      icon: <FaBan className="text-danger" />,
      label: "Block Author",
      action: () => showToast("Author blocked", "warning"),
    },
    {
      icon: <FaVolumeMute />,
      label: "Mute Author",
      action: () => showToast("Author muted", "info"),
    },
    {
      icon: <FaShieldAlt className="text-primary" />,
      label: "Restrict User",
      action: () => showToast("User restricted", "warning"),
    },
  ];

  const reportReasons = [
    "Spam",
    "False Information",
    "Harassment",
    "Hate Speech",
    "Violence",
    "Copyright",
    "Privacy",
    "Self-harm",
  ];

  const renderOptionButton = (option, index) => (
    <button
      key={index}
      className={`btn btn-sm w-100 text-start d-flex align-items-center gap-2 p-2 mb-2 ${
        option.danger
          ? "text-danger"
          : option.premium
          ? "text-warning"
          : "text-body"
      } ${reducedMotion ? "" : "transition-all"}`}
      onClick={option.action}
      style={{
        borderRadius: "10px",
        border: "none",
        backgroundColor: themeStyles.card,
        fontSize: `${fontSize * 0.8}px`,
        border: `1px solid ${themeStyles.card}`,
        minHeight: "44px",
      }}
      onMouseEnter={(e) => {
        if (!reducedMotion) {
          e.target.style.backgroundColor = isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)";
          e.target.style.borderColor = isDark
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.1)";
          e.target.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!reducedMotion) {
          e.target.style.backgroundColor = themeStyles.card;
          e.target.style.borderColor = themeStyles.card;
          e.target.style.transform = "translateY(0)";
        }
      }}
    >
      <span
        style={{
          fontSize: `${fontSize * 0.75}px`,
          width: "16px",
          color: option.color || "inherit",
        }}
      >
        {option.icon}
      </span>
      <span
        className="flex-grow-1"
        style={{
          fontSize: `${fontSize * 0.8}px`,
          fontWeight: "500",
        }}
      >
        {option.label}
      </span>
      {option.premium && (
        <small
          className="badge bg-warning text-dark"
          style={{
            fontSize: `${fontSize * 0.65}px`,
            padding: "2px 6px",
          }}
        >
          PRO
        </small>
      )}
    </button>
  );

  const ColumnHeader = ({ icon, title, color }) => (
    <div
      className="d-flex align-items-center gap-2 mb-3 p-2 rounded"
      style={{ backgroundColor: themeStyles.card }}
    >
      <span style={{ color, fontSize: `${fontSize * 0.8}px` }}>{icon}</span>
      <span
        className="fw-bold"
        style={{
          fontSize: `${fontSize * 0.8}px`,
          color: themeStyles.text,
        }}
      >
        {title}
      </span>
    </div>
  );

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        className={`btn btn-sm rounded-circle ${
          isDark ? "btn-outline-light" : "btn-outline-dark"
        } ${open ? "active shadow" : ""} ${
          reducedMotion ? "" : "transition-all"
        }`}
        onClick={toggleDropdown}
        aria-label="Post options"
        style={{
          fontSize: `${fontSize * 0.8}px`,
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(reducedMotion
            ? {}
            : {
                transition: "all 0.2s ease",
              }),
        }}
      >
        <FaEllipsisH />
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 shadow-lg border-0 rounded-3 overflow-hidden"
          style={{
            zIndex: 1050,
            width: "min(95vw, 420px)",
            backgroundColor: themeStyles.background,
            border: `1px solid ${themeStyles.border}`,
            fontSize: `${fontSize * 0.9}px`,
            ...(reducedMotion
              ? {}
              : {
                  animation: "fadeInUp 0.2s ease-out",
                }),
          }}
        >
          {/* Header */}
          <div
            className="p-3 border-bottom d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: themeStyles.surface,
              borderColor: themeStyles.border,
            }}
          >
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: themeStyles.text }}>
                Post Options
              </h6>
              <small style={{ color: themeStyles.textMuted }}>
                Manage your post interactions
              </small>
            </div>
            {isPremiumUser && (
              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                <FaCrown /> Premium
              </span>
            )}
          </div>

          {/* 3-Column Layout */}
          <div className="p-3">
            <div className="row g-3">
              {/* Engage Column */}
              <div className="col-4">
                <ColumnHeader
                  icon={<FaFire />}
                  title="Engage"
                  color="#dc3545"
                />
                <div className="d-flex flex-column">
                  {engageOptions.map(renderOptionButton)}
                </div>
              </div>

              {/* Enhance Column */}
              <div className="col-4">
                <ColumnHeader
                  icon={<FaMagic />}
                  title="Enhance"
                  color="#0d6efd"
                />
                <div className="d-flex flex-column">
                  {enhanceOptions.map(renderOptionButton)}
                </div>
              </div>

              {/* Safety Column */}
              <div className="col-4">
                <ColumnHeader
                  icon={<FaShieldAlt />}
                  title="Safety"
                  color="#198754"
                />
                <div className="d-flex flex-column">
                  {!showReportReasons ? (
                    safetyOptions.map(renderOptionButton)
                  ) : (
                    <div>
                      <div
                        className="d-flex align-items-center gap-2 mb-2 p-2 text-danger rounded"
                        style={{ backgroundColor: themeStyles.card }}
                      >
                        <FaExclamationTriangle />
                        <small className="fw-bold">Report Reason</small>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        {reportReasons.map((reason, index) => (
                          <button
                            key={index}
                            className="btn btn-sm btn-outline-danger w-100 text-start p-2"
                            onClick={() => handleReport(reason)}
                            style={{
                              fontSize: `${fontSize * 0.75}px`,
                              borderRadius: "8px",
                            }}
                          >
                            <small>{reason}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade Prompt */}
            {!isPremiumUser && (
              <div
                className="mt-3 p-3 rounded-2 text-center"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05))"
                    : "linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 191, 36, 0.1))",
                  border: `2px dashed #f59e0b`,
                }}
              >
                <FaCrown
                  className="text-warning mb-2"
                  style={{ fontSize: `${fontSize * 1.2}px` }}
                />
                <div
                  className="fw-semibold text-warning"
                  style={{ fontSize: `${fontSize * 0.85}px` }}
                >
                  Upgrade to Premium
                </div>
                <small
                  style={{
                    color: themeStyles.textMuted,
                    fontSize: `${fontSize * 0.75}px`,
                  }}
                >
                  Unlock boosting, AI tools & more
                </small>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="p-3 border-top"
            style={{
              backgroundColor: themeStyles.surface,
              borderColor: themeStyles.border,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-3">
                <small
                  style={{ color: themeStyles.textMuted }}
                  className="d-flex align-items-center gap-1"
                >
                  <FaHeart /> 2.4K
                </small>
                <small
                  style={{ color: themeStyles.textMuted }}
                  className="d-flex align-items-center gap-1"
                >
                  <FaComment /> 845
                </small>
                <small
                  style={{ color: themeStyles.textMuted }}
                  className="d-flex align-items-center gap-1"
                >
                  <FaShare /> 156
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setOpen(false)}
                style={{ fontSize: `${fontSize * 0.8}px` }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .transition-all {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default PostOptionsDropdown;
