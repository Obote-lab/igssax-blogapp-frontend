import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import PostMetaInfo from "./PostMetaInfo";
import PostExtraInfo from "./PostExtraInfo";

const APP_THEME_COLOR = "#73c2be";

function PostAuthorInfo({ author, created_at, privacy, hovered }) {
  return (
    <div className="flex-grow-1">
      {/* 🔹 Author Name + Verification */}
      <div className="d-flex align-items-center gap-2 mb-1">
        <strong
          className="fw-bold"
          style={{
            color: hovered ? APP_THEME_COLOR : "#000",
            textDecoration: hovered ? "underline" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {author?.first_name} {author?.last_name}
        </strong>
        {author?.is_verified && (
          <FaCheckCircle
            className="text-primary"
            size={14}
            title="Verified Account"
          />
        )}
      </div>

      {/* 🔹 Timestamp + Privacy */}
      <PostMetaInfo created_at={created_at} privacy={privacy} />

      {/* 🔹 Hover-only Extra Info */}
      {hovered && <PostExtraInfo author={author} />}
    </div>
  );
}

export default PostAuthorInfo;
