import { motion, AnimatePresence } from "framer-motion";
import CommentItem from "./CommentItem";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { useTheme } from "../../../../../ThemeContext";

function ReplyThread({
  comment,
  depth,
  expandedReplies,
  toggleReplies,
  handleAddComment,
  formatDate,
  currentUser,
}) {
  const { theme, highContrast } = useTheme();

  if (!comment.replies || comment.replies.length === 0 || depth >= 4)
    return null;

  const repliesOpen = expandedReplies[comment.id] || false;
  const replyCount = comment.replies.length;

  // 🎨 Line color based on theme
  const lineColor = highContrast
    ? theme === "dark"
      ? "#fff"
      : "#000"
    : theme === "dark"
    ? "#888"
    : "#ccc";

  // 🧠 Curve length grows with depth
  const curveWidth = 40 + depth * 10;
  const curveHeight = 20 + depth * 5;

  return (
    <div className="mt-2">
      {/* Toggle Replies */}
      <button
        className={`btn btn-sm fw-medium px-0 ${
          theme === "dark" ? "text-info" : "text-primary"
        }`}
        onClick={() => toggleReplies(comment.id)}
      >
        {repliesOpen ? (
          <>
            <FaCaretDown /> Hide {replyCount > 1 ? "replies" : "reply"}
          </>
        ) : (
          <>
            <FaCaretRight /> View {replyCount}{" "}
            {replyCount > 1 ? "replies" : "reply"}
          </>
        )}
      </button>

      {/* Replies Section */}
      <AnimatePresence initial={false}>
        {repliesOpen && (
          <motion.div
            key="replies"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-2"
          >
            {comment.replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                style={{ position: "relative", paddingLeft: "2.5rem" }}
              >
                {/* Curved connector line */}
                <motion.svg
                  width={curveWidth}
                  height={curveHeight}
                  viewBox={`0 0 ${curveWidth} ${curveHeight}`}
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: `-${curveWidth}px`,
                    overflow: "visible",
                  }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <motion.path
                    d={`M10 0 Q 10 ${curveHeight / 2}, ${curveWidth} ${
                      curveHeight / 2
                    }`}
                    stroke={lineColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>

                {/* Reply card */}
                <div
                  className={`comment-card p-2 mb-2 rounded ${
                    theme === "dark"
                      ? "bg-dark text-light"
                      : "bg-white text-dark"
                  }`}
                  style={{ marginLeft: `${depth * 1.5}rem` }}
                >
                  <CommentItem
                    comment={reply}
                    depth={depth + 1}
                    expandedReplies={expandedReplies}
                    toggleReplies={toggleReplies}
                    handleAddComment={handleAddComment}
                    formatDate={formatDate}
                    currentUser={currentUser}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReplyThread;
