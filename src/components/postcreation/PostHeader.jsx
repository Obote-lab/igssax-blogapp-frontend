import { useState } from "react";
import { FaGlobe, FaUserFriends, FaLock } from "react-icons/fa";

const themeColor = "#73c2be";

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

  const getPrivacyIcon = (value) => {
    const option = privacyOptions.find((opt) => opt.value === value);
    const IconComponent = option?.icon || FaGlobe;
    return <IconComponent size={12} />;
  };

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
        <h6 className="mb-0 fw-bold text-dark">
          {user?.first_name} {user?.last_name}
        </h6>

        {/* Privacy Selector */}
        <div className="position-relative">
          <button
            className="btn btn-sm btn-light rounded-pill mt-1 d-flex align-items-center gap-2"
            onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
            disabled={loading}
          >
            {getPrivacyIcon(privacy)}
            <span className="small">
              {privacyOptions.find((opt) => opt.value === privacy)?.label}
            </span>
          </button>

          {/* Privacy Dropdown */}
          {showPrivacyDropdown && (
            <div className="privacy-dropdown show shadow border-0">
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
                  >
                    <div className="privacy-icon">
                      <IconComponent style={{ color: option.color }} />
                    </div>
                    <div className="privacy-text">
                      <div className="privacy-label">{option.label}</div>
                      <div className="privacy-description">
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
