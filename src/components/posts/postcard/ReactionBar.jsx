// src/components/posts/postcard/ReactionBar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../ThemeContext";

/**
 * Named export so other components (e.g., CommentActions)
 * can import: `import ReactionBar, { REACTIONS } from ".../ReactionBar"`
 */
export const REACTIONS = {
  like: { label: "Like", color: "#1877F2", emoji: "👍" },
  love: { label: "Love", color: "#F23F5E", emoji: "❤️" },
  haha: { label: "Haha", color: "#F7B125", emoji: "😂" },
  wow: { label: "Wow", color: "#F7B125", emoji: "😮" },
  sad: { label: "Sad", color: "#F7B125", emoji: "😢" },
  angry: { label: "Angry", color: "#E24F3F", emoji: "😠" },
};

/**
 * ReactionBar — floating reaction selector
 * @param {function} onSelect  - Callback when reaction chosen
 * @param {boolean} isVisible  - Show/hide animation
 * @param {object} summary     - Optional summary data
 * @param {boolean} curveLeft  - If true, floats L-shaped toward left (for comments)
 */
export default function ReactionBar({
  onSelect,
  isVisible = true,
  summary = {},
  curveLeft = false,
}) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(null);

  const isDark = theme === "dark" || theme === "dark-mode";

  // Theme-aware colors
  const themeStyles = {
    background: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.2)"
      : "1px solid rgba(0, 0, 0, 0.1)",
    shadow: isDark
      ? "0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
      : "0 8px 25px rgba(0, 0, 0, 0.15)",
    text: isDark ? "#ffffff" : "#000000",
    arrowBg: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
    arrowBorder: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
  };

  const barVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 220,
        damping: 18,
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } },
  };

  const emojiVariants = {
    hidden: { opacity: 0, scale: 0.4, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 14 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="d-flex gap-2 px-3 py-2 rounded-4"
          style={{
            position: "absolute",
            bottom: curveLeft ? "35px" : "45px",
            left: curveLeft ? "0%" : "50%",
            transform: curveLeft
              ? "translateX(-20%) rotate(-3deg)"
              : "translateX(-50%)",
            background: themeStyles.background,
            backdropFilter: "blur(10px)",
            border: themeStyles.border,
            boxShadow: themeStyles.shadow,
            zIndex: 60,
            pointerEvents: "auto",
          }}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {Object.entries(REACTIONS).map(([key, { label, color, emoji }]) => (
            <motion.button
              key={key}
              variants={emojiVariants}
              className="btn border-0 d-flex flex-column align-items-center justify-content-center position-relative"
              onClick={() => onSelect?.(key)}
              title={label}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{
                scale: 1.4,
                y: -6,
                transition: { type: "spring", stiffness: 350, damping: 10 },
              }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: "40px",
                height: "40px",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <motion.div
                style={{
                  fontSize: "1.5rem",
                  textShadow: hovered === key ? `0 0 12px ${color}40` : "none",
                  transition: "text-shadow 0.15s ease",
                  filter:
                    hovered === key
                      ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                      : "none",
                }}
              >
                {emoji}
              </motion.div>

              {/* Reaction count badge */}
              {summary[key] > 0 && (
                <motion.span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    fontSize: "0.5rem",
                    padding: "2px 4px",
                    backgroundColor: color,
                    color: "white",
                    border: `1px solid ${themeStyles.background}`,
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.2)`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {summary[key]}
                </motion.span>
              )}

              <motion.small
                className="mt-1"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: "500",
                  color: isDark ? "#ffffff" : color,
                  opacity: hovered === key ? 1 : 0.8,
                  transition: "opacity 0.15s",
                  textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                }}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                {label}
              </motion.small>
            </motion.button>
          ))}

          {/* Arrow indicator for centered version */}
          {!curveLeft && (
            <motion.div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "12px",
                height: "12px",
                backgroundColor: themeStyles.arrowBg,
                borderRight: `1px solid ${themeStyles.arrowBorder}`,
                borderBottom: `1px solid ${themeStyles.arrowBorder}`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// // src/components/posts/postcard/ReactionBar.jsx
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// /**
//  * Named export so other components (e.g., CommentActions)
//  * can import: `import ReactionBar, { REACTIONS } from ".../ReactionBar"`
//  */
// export const REACTIONS = {
//   like: { label: "Like", color: "#1877F2", emoji: "👍" },
//   love: { label: "Love", color: "#F23F5E", emoji: "❤️" },
//   haha: { label: "Haha", color: "#F7B125", emoji: "😂" },
//   wow: { label: "Wow", color: "#F7B125", emoji: "😮" },
//   sad: { label: "Sad", color: "#F7B125", emoji: "😢" },
//   angry: { label: "Angry", color: "#E24F3F", emoji: "😠" },
// };

// /**
//  * ReactionBar — floating reaction selector
//  * @param {function} onSelect  - Callback when reaction chosen
//  * @param {boolean} isVisible  - Show/hide animation
//  * @param {object} summary     - Optional summary data
//  * @param {boolean} curveLeft  - If true, floats L-shaped toward left (for comments)
//  */
// export default function ReactionBar({
//   onSelect,
//   isVisible = true,
//   summary = {},
//   curveLeft = false,
// }) {
//   const [hovered, setHovered] = useState(null);

//   const barVariants = {
//     hidden: { opacity: 0, y: 15, scale: 0.9 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 220,
//         damping: 18,
//         staggerChildren: 0.08,
//       },
//     },
//     exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } },
//   };

//   const emojiVariants = {
//     hidden: { opacity: 0, scale: 0.4, y: 10 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: { type: "spring", stiffness: 400, damping: 14 },
//     },
//   };

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           variants={barVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           className="d-flex gap-2 px-3 py-2 rounded-4"
//           style={{
//             position: "absolute",
//             bottom: curveLeft ? "35px" : "45px",
//             left: curveLeft ? "0%" : "50%",
//             transform: curveLeft
//               ? "translateX(-20%) rotate(-3deg)"
//               : "translateX(-50%)",
//             background: "transparent",
//             zIndex: 60,
//             pointerEvents: "auto",
//           }}
//         >
//           {Object.entries(REACTIONS).map(([key, { label, color, emoji }]) => (
//             <motion.button
//               key={key}
//               variants={emojiVariants}
//               className="btn border-0 d-flex flex-column align-items-center justify-content-center"
//               onClick={() => onSelect?.(key)}
//               title={label}
//               onMouseEnter={() => setHovered(key)}
//               onMouseLeave={() => setHovered(null)}
//               whileHover={{
//                 scale: 1.4,
//                 y: -6,
//                 transition: { type: "spring", stiffness: 350, damping: 10 },
//               }}
//               whileTap={{ scale: 0.92 }}
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 background: "transparent",
//                 padding: 0,
//                 cursor: "pointer",
//               }}
//             >
//               <motion.div
//                 style={{
//                   fontSize: "1.5rem",
//                   textShadow: hovered === key ? `0 0 8px ${color}` : "none",
//                   transition: "text-shadow 0.15s ease",
//                 }}
//               >
//                 {emoji}
//               </motion.div>

//               <motion.small
//                 className="mt-1"
//                 style={{
//                   fontSize: "0.6rem",
//                   fontWeight: "500",
//                   color,
//                   opacity: hovered === key ? 1 : 0.8,
//                   transition: "opacity 0.15s",
//                 }}
//                 initial={{ opacity: 0, y: 3 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.12 }}
//               >
//                 {label}
//               </motion.small>
//             </motion.button>
//           ))}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
