import { useState, useRef } from "react";
import {
  FaRegComment,
  FaRegThumbsUp,
  FaThumbsUp,
  FaHeart,
  FaLaughBeam,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import PostHeader from "./PostHeader/PostHeader";
import PostMedia from "./PostMedia";
import TagList from "../TagList";
import ReactionBar from "./ReactionBar";
import ShareModal from "./ShareModal";
import Comments from "./comments/Comments";
import { useAuth } from "../../../context/AuthContext";
import { reactionsAPI } from "../../../api/axios";

function PostModal({ post, onClose }) {
  const { currentUser } = useAuth();
  const hoverTimeout = useRef(null);

  const [reactionData, setReactionData] = useState({
    summary: post.reactions?.summary || {},
    total: post.reactions?.total || 0,
    user_reacted: post.reactions?.user_reacted || null,
  });

  const [showReactions, setShowReactions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

  const handleReaction = async (reactionType) => {
    if (!currentUser) return;
    try {
      const { data } = await reactionsAPI.toggleReaction({
        reaction_type: reactionType,
        post: post.id,
      });

      setReactionData((prev) => {
        const summary = { ...prev.summary };
        let userReaction = prev.user_reacted;
        const { action } = data;

        if (action === "created") {
          summary[reactionType] = (summary[reactionType] || 0) + 1;
          userReaction = reactionType;
        } else if (action === "removed") {
          summary[reactionType] = Math.max((summary[reactionType] || 1) - 1, 0);
          userReaction = null;
        } else if (action === "updated") {
          const oldType = userReaction;
          if (oldType && summary[oldType]) summary[oldType] -= 1;
          summary[reactionType] = (summary[reactionType] || 0) + 1;
          userReaction = reactionType;
        }

        return {
          summary,
          user_reacted: userReaction,
          total: Object.values(summary).reduce((a, b) => a + b, 0),
        };
      });

      setShowReactions(false);
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  // Handle comment count update
  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
  };

  // Keep the ReactionBar open slightly longer to avoid flicker
  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setShowReactions(false), 300);
  };

  const currentReaction = reactionData.user_reacted;
  const themeColor = "#73c2be";

  // Reaction icon mapping
  const reactionIcons = {
    like: FaThumbsUp,
    love: FaHeart,
    haha: FaLaughBeam,
    wow: FaSurprise,
    sad: FaSadTear,
    angry: FaAngry,
  };

  // Get current icon dynamically
  const CurrentIcon =
    currentReaction && reactionIcons[currentReaction]
      ? reactionIcons[currentReaction]
      : FaRegThumbsUp;

  const currentLabel = currentReaction
    ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
    : "Like";

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Inline styles matching PostCard
  const styles = {
    actionBar: {
      display: "flex",
      justifyContent: "space-between",
      borderTop: "1px solid #e4e6ea",
      paddingTop: "12px",
      marginTop: "12px",
      gap: "4px",
    },
    actionBtn: (active) => ({
      background: "transparent",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      color: active ? themeColor : "#65676b",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.2s ease",
      flex: 1,
      minWidth: 0,
      maxWidth: "100%",
    }),
    icon: (active) => ({
      fontSize: "18px",
      width: "20px",
      height: "20px",
      color: active ? themeColor : "inherit",
      transition: "all 0.2s ease",
      flexShrink: 0,
    }),
    label: {
      fontSize: "0.9rem",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    badge: {
      background: themeColor,
      color: "white",
      borderRadius: "10px",
      padding: "1px 6px",
      fontSize: "0.75rem",
      fontWeight: 600,
      marginLeft: "4px",
      minWidth: "18px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  };

  if (!post) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">Post Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Post Header */}
            <PostHeader
              author={post.author}
              created_at={post.created_at}
              privacy={post.privacy}
            />

            {/* Post Content */}
            {post.content && (
              <p className="mb-3 fs-5 text-dark">{post.content}</p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3">
                <TagList tags={post.tags} />
              </div>
            )}

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mb-3">
                <PostMedia media={post.media} />
              </div>
            )}

            {/* Action Bar - Same as PostCard */}
            <div style={styles.actionBar}>
              {/* Reaction Button */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  minWidth: 0,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  style={styles.actionBtn(!!currentReaction)}
                  onClick={() => handleReaction("like")}
                >
                  <CurrentIcon style={styles.icon(!!currentReaction)} />
                  <span className="action-label" style={styles.label}>
                    {currentLabel}
                  </span>
                  {reactionData.total > 0 && (
                    <span className="action-count" style={styles.badge}>
                      {reactionData.total}
                    </span>
                  )}
                </button>
                {showReactions && <ReactionBar onSelect={handleReaction} />}
              </div>

              {/* Comments Button */}
              <button
                style={styles.actionBtn(false)}
                onClick={() => setShowComments(!showComments)}
              >
                <FaRegComment style={styles.icon(false)} />
                <span className="action-label" style={styles.label}>
                  Comment
                </span>
                {commentsCount > 0 && (
                  <span className="action-count" style={styles.badge}>
                    {commentsCount}
                  </span>
                )}
              </button>

              {/* Share Button */}
              <button
                style={styles.actionBtn(false)}
                onClick={() => setShowShareModal(true)}
              >
                <FaRegShareFromSquare style={styles.icon(false)} />
                <span className="action-label" style={styles.label}>
                  Share
                </span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-top pt-3">
                <Comments
                  postId={post.id}
                  formatDate={formatDate}
                  onCommentAdded={handleCommentAdded}
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal postId={post.id} onClose={() => setShowShareModal(false)} />
      )}

      {/* Responsive CSS - Same as PostCard */}
      <style jsx>{`
        /* Remove hover background */
        button:hover {
          background-color: transparent !important;
        }

        /* Hide labels on small screens but keep counts */
        @media (max-width: 768px) {
          .action-label {
            display: none !important;
          }

          .action-count {
            display: inline-flex !important;
            margin-left: 2px !important;
          }

          /* Adjust button padding for icons only */
          button {
            padding: 8px !important;
            gap: 2px !important;
          }
        }

        /* Show labels and counts on larger screens */
        @media (min-width: 769px) {
          .action-label {
            display: flex !important;
          }

          .action-count {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PostModal;
