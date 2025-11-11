import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileHoverCard from "./ProfileHoverCard";
import { useTheme } from "../../../../ThemeContext";

const APP_THEME_COLOR = "#73c2be";

function PostAvatar({ author, size = 56 }) {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();

  // Utility: get valid image URL
  const getAvatarUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  const avatarUrl = getAvatarUrl(author?.profile?.avatar);

  return (
    <div
      className="position-relative me-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/profile/${author?.id}`} className="text-decoration-none">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${author?.first_name} ${author?.last_name}`}
            className="rounded-circle shadow-sm"
            width={size}
            height={size}
            style={{
              transition: "all 0.3s ease",
              transform: hovered ? "scale(1.1)" : "scale(1)",
              boxShadow: hovered
                ? `0 4px 15px rgba(115, 194, 190, 0.3)`
                : "0 2px 6px rgba(0,0,0,0.1)",
              border: `3px solid ${APP_THEME_COLOR}`,
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "block";
            }}
          />
        ) : null}

        {/* Fallback initials avatar */}
        <img
          src={`https://ui-avatars.com/api/?name=${author?.first_name}+${author?.last_name}&background=73c2be&color=fff&size=${size}`}
          alt="Initials avatar"
          className="rounded-circle shadow-sm"
          width={size}
          height={size}
          style={{
            display: avatarUrl ? "none" : "block",
            transition: "all 0.3s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            border: `3px solid ${APP_THEME_COLOR}`,
          }}
        />
      </Link>

      {/* Hover card */}
      {hovered && <ProfileHoverCard author={author} theme={theme} />}
    </div>
  );
}

export default PostAvatar;
