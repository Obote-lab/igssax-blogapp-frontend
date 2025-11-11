import { useState, useMemo } from "react";

function CommentAvatar({ user, hovered = false, size = "sm" }) {
  const [avatarError, setAvatarError] = useState(false);

  // Map avatar sizes for consistent use
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
  };
  const sizePx = sizeMap[size] || 40;

  // Compute user name safely
  const userName = useMemo(() => {
    if (!user) return "User";
    if (user.first_name && user.last_name)
      return `${user.first_name} ${user.last_name}`;
    return user.username || user.name || "User";
  }, [user]);

  // Build possible avatar URLs
  const avatarUrl = useMemo(() => {
    if (!user) return null;

    const paths = [
      user?.profile?.avatar,
      user?.avatar,
      user?.image,
      user?.profile_picture,
      user?.picture?.url,
    ];

    for (const path of paths) {
      if (path)
        return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
    }
    return null;
  }, [user]);

  // Generate fallback initials avatar URL
  const fallbackUrl = useMemo(() => {
    const encodedName = encodeURIComponent(userName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=73c2be&color=fff&size=${sizePx}`;
  }, [userName, sizePx]);

  // Select which image to display
  const displayUrl = avatarError || !avatarUrl ? fallbackUrl : avatarUrl;

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        transition: "transform 0.3s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <img
        src={displayUrl}
        alt={userName}
        className="rounded-circle border border-2 shadow-sm"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "#f0f0f0",
          borderColor: "#73c2be",
        }}
        onError={() => setAvatarError(true)}
      />
    </div>
  );
}

export default CommentAvatar;