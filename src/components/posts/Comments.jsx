import { useState } from "react";
import { FaComment } from "react-icons/fa";
import { commentsAPI } from "../../api/axios";

//
// Recursive Comment component
//
function Comment({ comment, depth = 0, formatDate, onReply }) {
  return (
    <div
      style={{
        marginLeft: depth * 20,
        borderLeft: depth > 0 ? "1px solid #ddd" : "none",
        paddingLeft: depth > 0 ? "10px" : "0",
        marginBottom: "10px",
      }}
    >
      <strong>{comment.author}</strong>
      <p className="mb-1">{comment.content}</p>
      <small className="text-muted">{formatDate(comment.created_at)}</small>

      {/* Reply button */}
      {depth < 4 && (
        <button
          type="button" 
          className="btn btn-link btn-sm ms-2"
          onClick={() => onReply(comment.id)}
        >
          Reply
        </button>
      )}

      {/* Render nested replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            depth={depth + 1}
            formatDate={formatDate}
            onReply={onReply}
          />
        ))}
    </div>
  );
}

//
// Comments main component
//
function Comments({ postId, formatDate }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); 
  //
  // Fetch comments (nested from API)
  //
const fetchComments = async () => {
  try {
    const { data } = await commentsAPI.getComments(postId);
    // console.log("Fetched comments:", data);

    // handle if data is paginated
    setComments(Array.isArray(data) ? data : data.results || []);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
  }
};



  //
  // Add comment or reply
  //
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await commentsAPI.createComment({
        post: postId,
        content: newComment,
        parent: replyTo, 
      });
      setNewComment("");
      setReplyTo(null);
      fetchComments(); 
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <>
      {/* Toggle Comments Button */}
      <button
        type="button" 
        className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
        onClick={() => {
          setShowComments(!showComments);
          if (!showComments) fetchComments();
        }}
      >
        <FaComment /> Comment ({comments.length})
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 border-top pt-3 w-100">
          {comments.length === 0 ? (
            <p className="text-muted">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                depth={0}
                formatDate={formatDate}
                onReply={setReplyTo}
              />
            ))
          )}

          {/* Add Comment / Reply Input */}
          <div className="d-flex mt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-control me-2"
              placeholder={
                replyTo
                  ? `Replying to comment #${replyTo}...`
                  : "Write a comment..."
              }
            />
            <button
              type="button" 
              className="btn btn-primary"
              onClick={handleAddComment}
            >
              {replyTo ? "Reply" : "Post"}
            </button>
          </div>

          {/* Cancel reply button */}
          {replyTo && (
            <button
              type="button" 
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={() => setReplyTo(null)}
            >
              Cancel Reply
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Comments;
