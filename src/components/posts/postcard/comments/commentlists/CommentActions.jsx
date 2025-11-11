import { useState, useRef, useEffect } from "react";
import { FaThumbsUp, FaReply } from "react-icons/fa";
import { useTheme } from "../../../../../ThemeContext";
import ReactionBar, { REACTIONS } from "../../ReactionBar";

function CommentActions({ comment, depth, onReplyClick, onReact }) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "dark-mode";

  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(
    comment.user_reaction || null
  );
  const [reactionSummary, setReactionSummary] = useState(
    comment.reactions || {}
  );
  const hideTimer = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem(`comment_reactions_${comment.id}`)
    );
    if (stored && !comment.user_reaction) {
      setUserReaction(stored.userReaction || null);
      setReactionSummary(stored.reactionSummary || {});
    }
  }, [comment.id, comment.user_reaction]);

  const saveToLocal = (reaction, summary) => {
    localStorage.setItem(
      `comment_reactions_${comment.id}`,
      JSON.stringify({ userReaction: reaction, reactionSummary: summary })
    );
  };

  const handleReactionSelect = async (reactionType) => {
    if (!onReact) return;

    const isSame = userReaction === reactionType;
    let result;

    if (isSame) {
      result = await onReact(comment.id, null);
      if (result?.action === "removed") {
        const updated = { ...reactionSummary };
        updated[reactionType] = Math.max((updated[reactionType] || 1) - 1, 0);
        setUserReaction(null);
        setReactionSummary(updated);
        saveToLocal(null, updated);
      }
      setShowReactions(false);
      return;
    }

    result = await onReact(comment.id, reactionType);
    if (!result) return;

    const updated = { ...reactionSummary };
    if (userReaction && updated[userReaction] > 0) updated[userReaction] -= 1;
    updated[reactionType] = (updated[reactionType] || 0) + 1;

    setUserReaction(reactionType);
    setReactionSummary(updated);
    saveToLocal(reactionType, updated);
    setShowReactions(false);
  };

  const handleQuickLike = () => handleReactionSelect("like");

  const handleReactionMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowReactions(true);
  };

  const handleReactionMouseLeave = () => {
    hideTimer.current = setTimeout(() => setShowReactions(false), 300);
  };

  const totalReactions = Object.values(reactionSummary).reduce(
    (a, b) => a + b,
    0
  );
  const sortedReactions = Object.entries(reactionSummary)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0);

  const themeColor = "#73c2be";
  const textColor = isDark ? "#e0e0e0" : "#555";
  const borderColor = isDark ? "#444" : "#dee2e6";

  return (
    <div className="comment-actions d-flex align-items-center gap-4 mt-2">
      {/* 👍 Like/Reaction Button */}
      <div
        style={{ position: "relative" }}
        onMouseEnter={handleReactionMouseEnter}
        onMouseLeave={handleReactionMouseLeave}
      >
        <button
          className="btn btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: userReaction ? themeColor : textColor,
            backgroundColor: userReaction
              ? isDark
                ? "rgba(115, 194, 190, 0.15)"
                : "rgba(13, 110, 253, 0.1)"
              : "transparent",
            border: `1px solid ${userReaction ? themeColor : borderColor}`,
            transition: "all 0.3s ease",
            minWidth: "80px",
            justifyContent: "center",
          }}
          onClick={handleQuickLike}
        >
          {userReaction ? (
            <>
              <span style={{ fontSize: "1rem" }}>
                {REACTIONS[userReaction]?.emoji}
              </span>
              <span className="action-label">
                {REACTIONS[userReaction]?.label || "Like"}
              </span>
            </>
          ) : (
            <>
              <FaThumbsUp style={{ fontSize: "0.8rem" }} />
              <span className="action-label">Like</span>
            </>
          )}
        </button>

        {/* 🎨 ReactionBar directly above Like button */}
        {showReactions && (
          <ReactionBar
            onSelect={handleReactionSelect}
            isVisible={showReactions}
            summary={reactionSummary}
          />
        )}
      </div>

      {/* 💬 Reply Button */}
      {depth < 4 && (
        <button
          className="btn btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: textColor,
            backgroundColor: "transparent",
            border: `1px solid ${borderColor}`,
            transition: "all 0.3s ease",
            minWidth: "80px",
            justifyContent: "center",
          }}
          onClick={onReplyClick}
        >
          <FaReply style={{ fontSize: "0.8rem" }} />
          <span className="action-label">Reply</span>
        </button>
      )}

      {/* 🧡 Reaction Summary */}
      {totalReactions > 0 && (
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
            fontSize: "0.8rem",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            {sortedReactions.slice(0, 3).map(([key]) => (
              <span key={key} style={{ fontSize: "1rem" }}>
                {REACTIONS[key].emoji}
              </span>
            ))}
          </div>
          <span style={{ color: isDark ? "#aaa" : "#666", fontWeight: "600" }}>
            {totalReactions}
          </span>
        </div>
      )}

      {/* Responsive CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .comment-actions button .action-label {
            display: none; /* hide text labels on small devices */
          }
          .comment-actions button {
            min-width: auto;
            padding: 8px;
          }
          .comment-actions svg {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CommentActions;
