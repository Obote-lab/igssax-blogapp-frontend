import { useState } from "react";
import {
  FaTimes,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaLink,
  FaTelegram,
  FaReddit,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";

function ShareModal({ postId, onClose, onShare }) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const isDark = theme === "dark" || theme === "dark-mode";

  // Theme-aware styles
  const themeStyles = {
    background: isDark ? "#1a1d23" : "#ffffff",
    surface: isDark ? "#2d323d" : "#f8f9fa",
    text: isDark ? "#e9ecef" : "#212529",
    textMuted: isDark ? "#adb5bd" : "#6c757d",
    border: isDark ? "#495057" : "#dee2e6",
  };

  // Generate share URL (adjust based on your app's URL structure)
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareText = "Check out this post!";

  // Social media share URLs
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(shareText)}`,
    email: `mailto:?subject=${encodeURIComponent(
      shareText
    )}&body=${encodeURIComponent(shareUrl)}`,
  };

  const handleShare = async (platform) => {
    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Call onShare for copy action too
        if (onShare) {
          onShare();
        }
      } catch (err) {
        console.error("Failed to copy:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    if (platform === "email") {
      window.location.href = shareLinks.email;
    } else {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }

    // Call the onShare callback to increment share count
    if (onShare) {
      onShare();
    }
  };

  const shareOptions = [
    {
      platform: "facebook",
      icon: FaFacebook,
      label: "Facebook",
      color: "#1877F2",
    },
    {
      platform: "whatsapp",
      icon: FaWhatsapp,
      label: "WhatsApp",
      color: "#25D366",
    },
    {
      platform: "twitter",
      icon: FaTwitter,
      label: "Twitter",
      color: "#1DA1F2",
    },
    {
      platform: "linkedin",
      icon: FaLinkedin,
      label: "LinkedIn",
      color: "#0077B5",
    },
    {
      platform: "telegram",
      icon: FaTelegram,
      label: "Telegram",
      color: "#0088CC",
    },
    {
      platform: "reddit",
      icon: FaReddit,
      label: "Reddit",
      color: "#FF5700",
    },
    {
      platform: "email",
      icon: FaEnvelope,
      label: "Email",
      color: "#EA4335",
    },
    {
      platform: "copy",
      icon: copied ? FaCheck : FaLink,
      label: copied ? "Copied!" : "Copy Link",
      color: copied ? "#10B981" : "#6B7280",
    },
  ];

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content rounded-4 shadow-lg border-0"
          style={{
            backgroundColor: themeStyles.background,
            border: `1px solid ${themeStyles.border}`,
          }}
        >
          {/* Header */}
          <div
            className="modal-header border-0 pb-0"
            style={{ borderBottomColor: themeStyles.border }}
          >
            <h5
              className="modal-title fw-bold"
              style={{ color: themeStyles.text }}
            >
              Share Post
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              style={isDark ? { filter: "invert(1)" } : {}}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p className="mb-4" style={{ color: themeStyles.textMuted }}>
              Share this post with your friends and followers
            </p>

            {/* Share Options Grid */}
            <div className="row g-3">
              {shareOptions.map(({ platform, icon: Icon, label, color }) => (
                <div key={platform} className="col-4">
                  <button
                    className="btn d-flex flex-column align-items-center justify-content-center p-3 w-100 h-100 border-0"
                    style={{
                      background: themeStyles.surface,
                      borderRadius: "12px",
                      transition: "all 0.2s ease",
                      color: themeStyles.text,
                    }}
                    onClick={() => handleShare(platform)}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: color,
                        color: "white",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className="small fw-medium text-center"
                      style={{
                        color: themeStyles.text,
                        lineHeight: "1.2",
                        minHeight: "2.4rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Share URL */}
            <div
              className="mt-4 p-3 rounded-3"
              style={{
                backgroundColor: themeStyles.surface,
                border: `1px solid ${themeStyles.border}`,
              }}
            >
              <label
                className="form-label small mb-2 d-block"
                style={{ color: themeStyles.textMuted }}
              >
                Post Link
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm border-0"
                  value={shareUrl}
                  readOnly
                  style={{
                    fontSize: "0.8rem",
                    backgroundColor: isDark ? "#2d323d" : "#ffffff",
                    color: themeStyles.text,
                  }}
                />
                <button
                  className="btn border-0 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: isDark ? "#2d323d" : "#ffffff",
                    color: themeStyles.text,
                    minWidth: "40px",
                  }}
                  onClick={() => handleShare("copy")}
                >
                  {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
