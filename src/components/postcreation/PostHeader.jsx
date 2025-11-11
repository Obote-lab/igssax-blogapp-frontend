import { useState } from "react";
import { FaGlobe, FaUserFriends, FaLock } from "react-icons/fa";
import { useTheme } from "../../ThemeContext";

const privacyOptions = [
  {
    value: "public",
    label: "Public",
    icon: FaGlobe,
    description: "Anyone can see this post",
    color: "#1877f2",
  },
  {
    value: "friends",
    label: "Friends",
    icon: FaUserFriends,
    description: "Only your friends can see this",
    color: "#45bd62",
  },
  {
    value: "only_me",
    label: "Only Me",
    icon: FaLock,
    description: "Only you can see this post",
    color: "#65676b",
  },
];

function PostHeader({ user, privacy, setPrivacy, loading }) {
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const { theme } = useTheme();

  const getPrivacyIcon = (value) => {
    const option = privacyOptions.find((opt) => opt.value === value);
    const IconComponent = option?.icon || FaGlobe;
    return <IconComponent size={12} />;
  };

  // Get theme color dynamically
  const getThemeColor = () => {
    const root = document.documentElement;
    return (
      getComputedStyle(root).getPropertyValue("--accent-color").trim() ||
      "#73c2be"
    );
  };

  const themeColor = getThemeColor();

  return (
    <div className="d-flex align-items-center mb-3">
      <img
        src={user?.profile?.avatar || "https://via.placeholder.com/40"}
        alt={user?.first_name}
        className="rounded-circle me-3"
        width={48}
        height={48}
        style={{ objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <h6 className="mb-0 fw-bold" style={{ color: "var(--text-primary)" }}>
          {user?.first_name} {user?.last_name}
        </h6>

        {/* Privacy Selector */}
        <div className="position-relative">
          <button
            className="btn btn-sm rounded-pill mt-1 d-flex align-items-center gap-2"
            onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
            disabled={loading}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {getPrivacyIcon(privacy)}
            <span className="small">
              {privacyOptions.find((opt) => opt.value === privacy)?.label}
            </span>
          </button>

          {/* Privacy Dropdown */}
          {showPrivacyDropdown && (
            <div
              className="privacy-dropdown show shadow border-0"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {privacyOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className="privacy-option"
                    onClick={() => {
                      setPrivacy(option.value);
                      setShowPrivacyDropdown(false);
                    }}
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    <div className="privacy-icon">
                      <IconComponent style={{ color: option.color }} />
                    </div>
                    <div className="privacy-text">
                      <div
                        className="privacy-label"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {option.label}
                      </div>
                      <div
                        className="privacy-description"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {option.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
