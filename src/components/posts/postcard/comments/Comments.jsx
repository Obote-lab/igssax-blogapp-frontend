import { useState, useRef, useEffect } from "react";
import { commentsAPI } from "../../../../api/axios";
import CommentInput from "./CommentInput";
import CommentsList from "./commentlists/CommentsList";

function Comments({ postId, formatDate, onCommentAdded, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyingToUser, setReplyingToUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const commentInputRef = useRef(null);
  const safeCurrentUser = currentUser || getFallbackUser();

  function getFallbackUser() {
    console.warn("currentUser is undefined - using fallback user");
    return {
      id: 0,
      first_name: "User",
      last_name: "",
      username: "user",
      email: "user@example.com",
      profile: {
        avatar: null,
      },
      is_verified: false,
    };
  }

  // Fetch comments with better error handling
  const fetchComments = async () => {
    setIsLoading(true);
    setAuthError(false);
    try {
      const { data } = await commentsAPI.getComments(postId);

      // 🚨 CRITICAL FIX: Ensure we only get top-level comments
      const allComments = Array.isArray(data) ? data : data.results || [];

      // Filter out any comments that have parents (these should only be in replies)
      const topLevelComments = allComments.filter((comment) => {
        const isTopLevel = !comment.parent;
        if (!isTopLevel) {
          console.warn(
            `🚨 Filtered out comment ${comment.id} with parent ${comment.parent} from top-level list`
          );
        }
        return isTopLevel;
      });

      console.log(
        `🔍 Fetched ${topLevelComments.length} top-level comments (filtered from ${allComments.length} total)`
      );
      setComments(topLevelComments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      if (err.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🚨 UPDATED: Optimistic update for replies to prevent duplicates
  const addReplyToComment = (parentCommentId, newReply) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === parentCommentId) {
          // Add the new reply to the parent comment's replies
          const updatedReplies = [...(comment.replies || []), newReply];
          console.log(
            `✅ Optimistically added reply to comment ${parentCommentId}`
          );
          return { ...comment, replies: updatedReplies };
        }

        // Also check nested replies recursively
        if (comment.replies && comment.replies.length > 0) {
          const updatedReplies = updateNestedReplies(
            comment.replies,
            parentCommentId,
            newReply
          );
          if (updatedReplies !== comment.replies) {
            return { ...comment, replies: updatedReplies };
          }
        }

        return comment;
      });
    });
  };

  // Helper function to update nested replies
  const updateNestedReplies = (replies, parentCommentId, newReply) => {
    return replies.map((reply) => {
      if (reply.id === parentCommentId) {
        const nestedReplies = [...(reply.replies || []), newReply];
        console.log(
          `✅ Optimistically added nested reply to comment ${parentCommentId}`
        );
        return { ...reply, replies: nestedReplies };
      }

      if (reply.replies && reply.replies.length > 0) {
        const updatedNestedReplies = updateNestedReplies(
          reply.replies,
          parentCommentId,
          newReply
        );
        if (updatedNestedReplies !== reply.replies) {
          return { ...reply, replies: updatedNestedReplies };
        }
      }

      return reply;
    });
  };

  // 🚨 UPDATED: Improved handleAddComment to prevent duplicates
  const handleAddComment = async (commentData = null) => {
    try {
      setAuthError(false);

      // 🚨 CASE 1: This is a reply that was already created via ReplyInput
      if (
        commentData &&
        commentData.id &&
        commentData.author &&
        commentData.parent
      ) {
        console.log(
          `✅ Reply ${commentData.id} already created, adding optimistically to parent ${commentData.parent}`
        );

        // Use optimistic update to add the reply to the correct parent
        addReplyToComment(commentData.parent, commentData);

        // Optional: Refresh after a delay to ensure data consistency
        setTimeout(() => {
          fetchComments();
        }, 500);

        if (onCommentAdded) onCommentAdded();
        return commentData;
      }

      // 🚨 CASE 2: This is an axios response for a reply
      if (commentData && commentData.data && commentData.data.parent) {
        console.log(
          `✅ Handling axios reply response for parent ${commentData.data.parent}`
        );
        addReplyToComment(commentData.data.parent, commentData.data);
        setTimeout(() => {
          fetchComments();
        }, 500);
        if (onCommentAdded) onCommentAdded();
        return commentData.data;
      }

      // 🚨 CASE 3: This is a NEW top-level comment (from CommentInput)
      const content = commentData?.content || newComment;
      const attachments = commentData?.attachments || [];

      // Basic validation
      if (!content?.trim() && attachments.length === 0) {
        throw new Error("Comment cannot be empty");
      }

      // Prepare payload for top-level comment
      const apiData = new FormData();
      apiData.append("post", postId);

      if (content && typeof content === "string" && content.trim()) {
        apiData.append("content", content.trim());
      }

      // Handle attachments
      attachments.forEach((file) => {
        if (file instanceof File) {
          const fileType = file.type.toLowerCase();
          if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
            apiData.append("attachments", file);
          }
        } else if (file?.url && file.url.endsWith(".gif")) {
          apiData.append("gif_urls", file.url);
        }
      });

      console.log("📤 Sending NEW top-level comment to API");

      // Send to backend
      const response = await commentsAPI.createComment(apiData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setNewComment("");
      setReplyTo(null);
      setReplyingToUser("");

      // Refresh comments to show the new top-level comment
      await fetchComments();

      if (onCommentAdded) onCommentAdded();

      return response.data;
    } catch (err) {
      console.error("❌ Failed to add comment:", err);
      if (err.response?.status === 401) {
        setAuthError(true);
      }
      throw err;
    }
  };

  // Handle reply from CommentsList
  const handleReply = (comment) => {
    console.log("Setting reply to:", comment);
    setReplyTo(comment);
    setReplyingToUser(
      comment.author?.username || comment.author?.first_name || "User"
    );

    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  // Handle key press (Enter to submit) for main comment input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Load comments on mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Debug: Log comments structure
  useEffect(() => {
    if (comments.length > 0) {
      console.log("🔍 Current comments structure:", comments);
    }
  }, [comments]);

  return (
    <div className="bg-transparent">
      {/* Comments Header */}
      <div className="px-3 py-2 border-bottom">
        <h5 className="mb-0 fw-semibold text-dark">
          Comments ({comments.length})
        </h5>
        {/* Debug info - remove in production */}
        {!currentUser && (
          <small className="text-warning">
            Debug: Using fallback user - check parent component
          </small>
        )}
      </div>

      {/* Authentication Error */}
      {authError && (
        <div className="alert alert-warning m-3" role="alert">
          <strong>Session expired!</strong> Please refresh the page or log in
          again to comment.
        </div>
      )}

      {/* Comments List */}
      <CommentsList
        comments={comments}
        isLoading={isLoading}
        formatDate={formatDate}
        currentUser={safeCurrentUser}
        handleAddComment={handleAddComment}
        onLoadMore={() => console.log("Load more comments")}
      />

      {/* Add Comment Input - Only show if not auth error */}
      {!authError && (
        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          replyTo={replyTo}
          replyingToUser={replyingToUser}
          setReplyTo={setReplyTo}
          setReplyingToUser={setReplyingToUser}
          handleAddComment={handleAddComment}
          handleKeyPress={handleKeyPress}
          commentInputRef={commentInputRef}
          currentUser={safeCurrentUser}
        />
      )}
    </div>
  );
}

export default Comments;
