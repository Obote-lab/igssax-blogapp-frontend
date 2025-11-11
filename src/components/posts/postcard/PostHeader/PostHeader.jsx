import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";

// Local components inside PostHeader folder
import PostAvatar from "./PostAvatar";
import PostAuthorInfo from "./PostAuthorInfo";
import PostOptionsDropdown from "./PostOptionsDropdown";

function PostHeader({ author, created_at, privacy, post }) {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="position-relative">
      {/* 🔹 Header Row: Avatar + Info + Options */}
      <div className="d-flex align-items-start justify-content-between mb-3">
        {/* Left Section: Avatar + Info */}
        <div
          className="d-flex align-items-center flex-grow-1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Avatar */}
          <PostAvatar author={author} size={56} hovered={hovered} />

          {/* Author Info */}
          <Link
            to={`/profile/${author?.id}`}
            className="flex-grow-1 text-decoration-none text-dark"
            style={{
              transition: "transform 0.3s ease",
              transform: hovered ? "translateX(5px)" : "translateX(0)",
            }}
          >
            <PostAuthorInfo
              author={author}
              created_at={created_at}
              privacy={privacy}
              hovered={hovered}
            />
          </Link>
        </div>

        {/* Right Section: Post Options Dropdown */}
        <div className="ms-2">
          <PostOptionsDropdown post={post} />
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
