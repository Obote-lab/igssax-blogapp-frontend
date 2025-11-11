import { useState } from "react";
import axios from "../../../../../api/axios";
import CommentHeader from "./CommentHeader";
import CommentActions from "./CommentActions";
import ReplyThread from "./ReplyThread";
import ReplyInput from "./replyInput/ReplyInput";
import CommentAttachments from "./CommentAttachments";

function CommentItem({
  comment,
  depth,
  formatDate,
  currentUser,
  expandedReplies,
  toggleReplies,
  handleAddComment,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const replyingToName =
    comment?.author?.first_name + " " + comment?.author?.last_name ||
    comment?.author?.username ||
    "User";

  const handleSubmitReply = async ({ text, attachments = [] }) => {
    const trimmed = text?.trim();
    if (!trimmed && attachments.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("content", trimmed || "");
      formData.append("parent", comment.id);

      const postId = comment.post || comment.parent?.post || null;
      if (postId) formData.append("post", postId);

      const gifUrls = [];
      attachments.forEach((file) => {
        if (file.type === "gif") gifUrls.push(file.url);
        else if (file instanceof File) formData.append("attachments", file);
      });
      gifUrls.forEach((url) => formData.append("gif_urls", url));

      const response = await axios.post("comments/comments/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      await handleAddComment(response.data);
      setIsReplying(false);
      setReplyText("");
    } catch (error) {
      console.error("Reply failed:", error.response?.data || error);
    }
  };

  const handleReact = async (commentId, reactionType) => {
    try {
      const payload = { comment: commentId, reaction_type: reactionType };
      const response = await axios.post(
        "reactions/reactions/toggle/",
        payload,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Reaction failed:", error.response?.data || error.message);
      return null;
    }
  };

  return (
    <div
      className="comment-item d-flex gap-2 py-3"
      style={{
        marginLeft: depth > 0 ? `${depth * 1.5}rem` : 0,
        borderBottom: depth === 0 ? "1px solid #eee" : "none",
      }}
    >
   

      {/* Content */}
      <div className="flex-grow-1">
        <CommentHeader comment={comment} formatDate={formatDate} />

        {comment.content && (
          <p className="mb-1" style={{ fontSize: "0.95rem" }}>
            {comment.content}
          </p>
        )}

        {comment.attachments?.length > 0 && (
          <CommentAttachments attachments={comment.attachments} />
        )}

        <CommentActions
          comment={comment}
          depth={depth}
          onReplyClick={() => setIsReplying(true)}
          onReact={handleReact}
        />

        {isReplying && (
          <div className="mt-2">
            <ReplyInput
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleSubmitReply}
              onCancelReply={() => setIsReplying(false)}
              currentUser={currentUser}
              replyingTo={replyingToName.trim()}
            />
          </div>
        )}

        <ReplyThread
          comment={comment}
          depth={depth}
          expandedReplies={expandedReplies}
          toggleReplies={toggleReplies}
          handleAddComment={handleAddComment}
          formatDate={formatDate}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default CommentItem;
