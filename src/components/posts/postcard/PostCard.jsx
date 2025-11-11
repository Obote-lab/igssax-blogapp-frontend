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
import PostModal from "./PostModal";
import ShareModal from "./ShareModal";
import ReactionBar from "./ReactionBar";
import { useAuth } from "../../../context/AuthContext";
import { reactionsAPI, sharesAPI } from "../../../api/axios";

function PostCard({ post }) {
  const {
    id,
    author,
    content,
    privacy,
    created_at,
    media,
    tags,
    reactions,
    comments_count,
    shares_count,
  } = post;
  const { currentUser } = useAuth();
  const hoverTimeout = useRef(null);

  const [reactionData, setReactionData] = useState({
    summary: reactions?.summary || {},
    total: reactions?.total || 0,
    user_reacted: reactions?.user_reacted || null,
  });
  const [commentsCount, setCommentsCount] = useState(comments_count || 0);
  const [sharesCount, setSharesCount] = useState(shares_count || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleReaction = async (reactionType) => {
    if (!currentUser) return;
    try {
      const { data } = await reactionsAPI.toggleReaction({
        reaction_type: reactionType,
        post: id,
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

  const handleCommentAdded = () => setCommentsCount((prev) => prev + 1);

  const handleShare = async () => {
    if (!currentUser) return;
    try {
      await sharesAPI.createShare({ post: id });
      setSharesCount((prev) => prev + 1);
      setShowShareModal(false);
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowReactions(true);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setShowReactions(false), 300);
  };

  const currentReaction = reactionData.user_reacted;
  const themeColor = "#73c2be";

  const reactionIcons = {
    like: FaThumbsUp,
    love: FaHeart,
    haha: FaLaughBeam,
    wow: FaSurprise,
    sad: FaSadTear,
    angry: FaAngry,
  };

  const CurrentIcon =
    currentReaction && reactionIcons[currentReaction]
      ? reactionIcons[currentReaction]
      : FaRegThumbsUp;

  const currentLabel = currentReaction
    ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
    : "Like";

  // Inline styles
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

  return (
    <div className="card shadow-sm mb-4 rounded-4 position-relative">
      <div className="card-body">
        <PostHeader author={author} created_at={created_at} privacy={privacy} />
        {content && <p className="mb-3">{content}</p>}
        {tags && <TagList tags={tags} />}
        {media && <PostMedia media={media} />}

        {/* Action Bar */}
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
            onClick={() => setShowComments(true)}
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
            {sharesCount > 0 && (
              <span className="action-count" style={styles.badge}>
                {sharesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showComments && (
        <PostModal
          post={post}
          onClose={() => setShowComments(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
      {showShareModal && (
        <ShareModal
          postId={post.id}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}

      {/* Responsive CSS */}
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

export default PostCard;
