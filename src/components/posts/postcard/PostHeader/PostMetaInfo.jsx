import React from "react";
import PostPrivacyIcon from "./PostPrivacyIcon";
import { useTheme } from "../../../../ThemeContext";

function PostMetaInfo({ created_at, privacy, edited }) {
  const { language, highContrast } = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const diff = (Date.now() - date.getTime()) / 1000; // seconds

    const seconds = Math.floor(diff);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    const weeks = Math.floor(diff / 604800);
    const months = Math.floor(diff / 2592000); // ~30 days
    const years = Math.floor(diff / 31536000);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 5) return `${weeks}wk${weeks > 1 ? "s" : ""} ago`;
    if (months < 12) return `${months}mon${months > 1 ? "s" : ""} ago`;
    return `${years}y ago`;
  };

  return (
    <div
      className="d-flex align-items-center small gap-2"
      style={{ color: highContrast ? "#000" : "#6c757d" }}
    >
      {/* Timestamp */}
      <span aria-label={`Posted on ${formatDate(created_at)}`}>
        {getRelativeTime(created_at)} · {formatDate(created_at)}
      </span>

      {/* Separator */}
      <span>•</span>

      {/* Privacy Icon */}
      <PostPrivacyIcon privacy={privacy} />

      {/* Edited indicator */}
      {edited && <span className="fst-italic">· Edited</span>}
    </div>
  );
}

export default PostMetaInfo;
