import { useState, useRef, useEffect } from "react";
import {
  FaReply,
  FaEllipsisH,
  FaThumbsUp,
  FaRegThumbsUp,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaFlag,
  FaShare,
  FaBookmark,
  FaThumbtack,
  FaStar,
  FaEyeSlash,
  FaBan,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
  FaRegHeart,
  FaRegLaugh,
  FaRegSurprise,
  FaRegSadTear,
  FaRegAngry,
} from "react-icons/fa";
import CommentAvatar from "./CommentAvatar";

// Reaction types configuration
const REACTION_TYPES = {
  like: {icon: FaThumbsUp, activeIcon: FaThumbsUp,label: "Like",color: "#1877F2",activeColor: "#1877F2", },
  love: {icon: FaRegHeart, activeIcon: FaHeart,label: "Love",color: "#F33E58",activeColor: "#F33E58", },
  laugh: {icon: FaRegLaugh, activeIcon: FaLaugh,label: "Haha",color: "#F7B125",activeColor: "#F7B125",},
  wow: {icon: FaRegSurprise, activeIcon: FaSurprise,label: "Wow",color: "#F7B125",activeColor: "#F7B125",},
  sad: {icon: FaRegSadTear, activeIcon: FaSadTear,label: "Sad",color: "#F7B125",activeColor: "#F7B125",},
  angry: {icon: FaRegAngry, activeIcon: FaAngry,label: "Angry",color: "#E4713A",activeColor: "#E4713A",},
};

function Comment({
  comment,
  depth = 0,
  formatDate,
  onReply,
  onLike,
  onReaction,
  onEdit,
  onDelete,
  onReport,
  onShare,
  onSave,
  currentUser,
  postAuthor,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(
    comment.user_reaction || null
  );
  const [reactionCounts, setReactionCounts] = useState(comment.reactions || {});
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [hovered, setHovered] = useState(false);

  const optionsRef = useRef(null);
  const reactionsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
      if (
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate total reactions
  const totalReactions = Object.values(reactionCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get comment options based on user roles
  const getCommentOptions = () => {
    const isCommentAuthor =
      currentUser && comment.author?.id === currentUser.id;
    const isPostAuthor = currentUser && postAuthor?.id === currentUser.id;
    const isAdmin = currentUser?.role === "admin";

    const options = [];

    if (isCommentAuthor) {
      options.push({
        action: "edit",
        label: "Edit",
        icon: FaEdit,
        className: "text-primary",
      });
      options.push({
        action: "delete",
        label: "Delete",
        icon: FaTrash,
        className: "text-danger",
      });
      if (isPostAuthor) {
        options.push({
          action: "pin",
          label: "Pin comment",
          icon: FaThumbtack,
          className: "text-warning",
        });
      }
    }

    if (isPostAuthor && !isCommentAuthor) {
      options.push({
        action: "delete",
        label: "Delete as post owner",
        icon: FaTrash,
        className: "text-danger",
      });
      options.push({
        action: "highlight",
        label: "Highlight",
        icon: FaStar,
        className: "text-warning",
      });
    }

    if (isAdmin) {
      options.push({
        action: "hide",
        label: "Hide comment",
        icon: FaEyeSlash,
        className: "text-secondary",
      });
      options.push({
        action: "ban",
        label: "Ban user",
        icon: FaBan,
        className: "text-danger",
      });
    }

    // Available to everyone
    options.push({
      action: "report",
      label: "Report",
      icon: FaFlag,
      className: "text-muted",
    });
    options.push({
      action: "share",
      label: "Share",
      icon: FaShare,
      className: "text-muted",
    });
    options.push({
      action: "save",
      label: "Save",
      icon: FaBookmark,
      className: "text-muted",
    });

    return options;
  };

  // Smart timestamp formatting
  const formatSmartTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;

    return date.toLocaleDateString();
  };

  // Handle option selection
  const handleOptionClick = (action) => {
    setShowOptions(false);

    switch (action) {
      case "edit":
        setIsEditing(true);
        break;
      case "delete":
        onDelete?.(comment.id);
        break;
      case "report":
        onReport?.(comment.id);
        break;
      case "share":
        onShare?.(comment);
        break;
      case "save":
        onSave?.(comment.id);
        break;
      default:
        console.log("Action not implemented:", action);
    }
  };

  // Handle reaction
  const handleReaction = (reactionType) => {
    setShowReactions(false);

    if (userReaction === reactionType) {
      // Remove reaction
      setUserReaction(null);
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, (prev[reactionType] || 0) - 1),
      }));
    } else {
      // Add new reaction
      if (userReaction) {
        // Remove previous reaction
        setReactionCounts((prev) => ({
          ...prev,
          [userReaction]: Math.max(0, (prev[userReaction] || 0) - 1),
        }));
      }
      setUserReaction(reactionType);
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: (prev[reactionType] || 0) + 1,
      }));
    }

    onReaction?.(comment.id, reactionType);
  };

  // Handle edit submission
  const handleEditSubmit = () => {
    onEdit?.(comment.id, editContent);
    setIsEditing(false);
  };

  // Handle edit cancellation
  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const authorName =
    comment.author?.first_name && comment.author?.last_name
      ? `${comment.author.first_name} ${comment.author.last_name}`
      : comment.author?.username || "Unknown User";

  const commentOptions = getCommentOptions();

  return (
    <div
      className={`comment-container d-flex gap-3 py-2 ${
        depth > 0
          ? "ps-4 ms-2 border-start border-2 border-light"
          : "border-bottom border-light"
      } ${depth === 0 ? "border-bottom" : ""} ${
        comment.is_pinned ? "bg-warning bg-opacity-10" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Comment Avatar */}
      <CommentAvatar user={comment.author} hovered={hovered} size="sm" />

      {/* Comment Content */}
      <div className="flex-grow-1 position-relative">
        {/* Engagement Indicator */}
        {totalReactions > 5 && (
          <div className="position-absolute top-0 end-0">
            <span className="badge bg-primary bg-opacity-10 text-primary small">
              🔥 Popular
            </span>
          </div>
        )}

        {/* Comment Header */}
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <div className="d-flex align-items-center gap-1 mb-1">
              <span
                className={`fw-semibold ${
                  hovered ? "text-primary" : "text-dark"
                }`}
                style={{ fontSize: "0.9rem", transition: "color 0.3s ease" }}
              >
                {authorName}
              </span>
              {comment.author?.is_verified && (
                <FaCheckCircle className="text-primary" size={12} />
              )}
              {comment.is_pinned && (
                <FaThumbtack
                  className="text-warning"
                  size={10}
                  title="Pinned comment"
                />
              )}
            </div>
            <small
              className="text-muted"
              title={new Date(comment.created_at).toLocaleString()}
            >
              {formatSmartTime(comment.created_at)}
              {comment.edited_at && (
                <span
                  className="ms-1 text-muted"
                  title={`Edited ${formatSmartTime(comment.edited_at)}`}
                >
                  • edited
                </span>
              )}
            </small>
          </div>

          {/* Options Menu */}
          <div className="position-relative" ref={optionsRef}>
            <button
              className="btn btn-sm text-muted p-1 rounded"
              onClick={() => setShowOptions(!showOptions)}
              title="More options"
            >
              <FaEllipsisH size={12} />
            </button>

            {showOptions && (
              <div className="position-absolute end-0 mt-1 bg-none border rounded shadow-lg z-3 min-w-150">
                {commentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.action}
                      className={`dropdown-item d-flex align-items-center gap-2 py-2 px-3 ${
                        option.className || ""
                      }`}
                      onClick={() => handleOptionClick(option.action)}
                    >
                      <Icon size={14} />
                      <span style={{ fontSize: "0.85rem" }}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Comment Text / Edit Area */}
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="form-control form-control-sm"
              rows="3"
              style={{ fontSize: "0.9rem" }}
            />
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleEditSubmit}
                disabled={!editContent.trim()}
              >
                Save
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mb-2"
            style={{ fontSize: "0.9rem", lineHeight: "1.4" }}
          >
            {comment.content}
          </div>
        )}

        {/* Comment Actions */}
        <div className="d-flex align-items-center gap-3 position-relative">
          {/* Reactions Bar */}
          <div className="d-flex align-items-center gap-2" ref={reactionsRef}>
            {/* Reaction Button */}
            <button
              className="btn btn-sm p-0 text-muted border-0 position-relative"
              onMouseEnter={() => setShowReactions(true)}
              onClick={() => handleReaction("like")}
            >
              <div className="d-flex align-items-center gap-1">
                {userReaction ? (
                  <>
                    {React.createElement(
                      REACTION_TYPES[userReaction].activeIcon,
                      {
                        size: 16,
                        color: REACTION_TYPES[userReaction].activeColor,
                      }
                    )}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: REACTION_TYPES[userReaction].activeColor,
                      }}
                    >
                      {REACTION_TYPES[userReaction].label}
                    </span>
                  </>
                ) : (
                  <>
                    <FaRegThumbsUp size={14} />
                    <span style={{ fontSize: "0.8rem" }}>Like</span>
                  </>
                )}
              </div>
            </button>

            {/* Reaction Picker */}
            {showReactions && (
              <div className="position-absolute bottom-100 start-0 bg-none border rounded shadow-lg p-2 d-flex gap-1 z-3">
                {Object.entries(REACTION_TYPES).map(([type, reaction]) => {
                  const Icon =
                    userReaction === type ? reaction.activeIcon : reaction.icon;
                  return (
                    <button
                      key={type}
                      className="btn btn-sm p-2 rounded-circle reaction-btn"
                      onClick={() => handleReaction(type)}
                      onMouseEnter={() => {}}
                      title={reaction.label}
                      style={{
                        transition: "all 0.2s ease",
                        transform: "scale(1)",
                      }}
                    >
                      <Icon
                        size={20}
                        color={
                          userReaction === type
                            ? reaction.activeColor
                            : reaction.color
                        }
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reaction Count */}
            {totalReactions > 0 && (
              <button
                className="btn btn-sm p-0 text-muted border-0"
                onClick={() => setShowReactions(!showReactions)}
                title={`${totalReactions} reactions`}
              >
                <span
                  className="badge bg-none text-dark d-flex align-items-center gap-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  {totalReactions}
                  {userReaction &&
                    React.createElement(
                      REACTION_TYPES[userReaction].activeIcon,
                      {
                        size: 10,
                        color: REACTION_TYPES[userReaction].activeColor,
                      }
                    )}
                </span>
              </button>
            )}
          </div>

          {/* Reply Button */}
          {depth < 4 && (
            <button
              className="btn btn-sm p-0 text-muted border-0"
              onClick={() => onReply(comment.id, authorName)}
            >
              <div className="d-flex align-items-center gap-1">
                <FaReply size={12} />
                <span style={{ fontSize: "0.8rem" }}>Reply</span>
              </div>
            </button>
          )}
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                formatDate={formatDate}
                onReply={onReply}
                onLike={onLike}
                onReaction={onReaction}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
                onShare={onShare}
                onSave={onSave}
                currentUser={currentUser}
                postAuthor={postAuthor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
