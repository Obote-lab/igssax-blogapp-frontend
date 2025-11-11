import React from "react";
import { FaGlobeAmericas, FaLock, FaUsers } from "react-icons/fa";
import { useTheme } from "../../../../ThemeContext";

function PostPrivacyIcon({ privacy }) {
  const { highContrast, colorBlindMode } = useTheme();

  if (!privacy) return null;
  const normalized = privacy.toLowerCase();

  // Decide colors based on privacy + accessibility
  let color = "#6c757d"; // default muted gray
  if (normalized === "public") color = "#0d6efd"; // blue
  if (normalized === "friends") color = "#198754"; // green
  if (normalized === "private") color = "#6c757d"; // gray

  if (highContrast) {
    color = normalized === "private" ? "#000" : "#fff";
  }

  if (colorBlindMode) {
    // Use color-blind safe palette (blue/orange)
    if (normalized === "public") color = "#0077cc";
    if (normalized === "friends") color = "#ff9900";
    if (normalized === "private") color = "#555";
  }

  const commonProps = {
    size: 14,
    style: {
      color,
      transition: "color 0.3s ease, transform 0.2s ease",
    },
    className: "privacy-icon",
  };

  switch (normalized) {
    case "public":
      return (
        <FaGlobeAmericas
          {...commonProps}
          title="Public · Visible to everyone"
          aria-label="Public post"
        />
      );
    case "friends":
      return (
        <FaUsers
          {...commonProps}
          title="Friends · Visible to your friends"
          aria-label="Friends only"
        />
      );
    case "private":
      return (
        <FaLock
          {...commonProps}
          title="Only Me · Visible only to you"
          aria-label="Private post"
        />
      );
    default:
      return null;
  }
}

<style jsx>{`
  .privacy-icon:hover {
  transform: scale(1.2);
  filter: brightness(1.2);
  }
`}</style>

export default PostPrivacyIcon;
