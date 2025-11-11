import { motion } from "framer-motion";

function AvatarSection({ currentUser, themeColor }) {
  const avatarUrl =
    currentUser?.avatar ||
    currentUser?.profile_image ||
    "/static/images/default-avatar.png";

  return (
    <motion.div
      className="avatar-glow rounded-circle p-1"
      style={{
        background: `radial-gradient(circle at center, ${themeColor}55, transparent 70%)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={avatarUrl}
        alt="Your avatar"
        className="rounded-circle"
        width={34}
        height={34}
        style={{
          objectFit: "cover",
          border: `2px solid ${themeColor}`,
          boxShadow: `0 0 8px ${themeColor}88`,
        }}
      />
    </motion.div>
  );
}

export default AvatarSection;
