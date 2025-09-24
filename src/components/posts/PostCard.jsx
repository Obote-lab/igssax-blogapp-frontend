import { useState } from "react";
import { FaComment, FaShare } from "react-icons/fa";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import TagList from "./TagList";
import PostModal from "./PostModal";
import Reactions from "./Reactions"; 
import ShareButton from "./ShareButton";

function PostCard({ post }) {
  const { id, author, content, privacy, created_at, media, tags } = post;

  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <>
      <div className="card shadow-sm mb-4 rounded-4">
        <div className="card-body">
          {/* Post Header */}
          <PostHeader
            author={author}
            created_at={created_at}
            privacy={privacy}
            formatDate={formatDate}
          />

          {/* Content */}
          {content && <p className="mb-3">{content}</p>}

          {/* Tags */}
          {tags && tags.length > 0 && <TagList tags={tags} />}

          {/* Media */}
          {media && media.length > 0 && <PostMedia media={media} />}

          {/* Actions */}
          <div className="d-flex justify-content-around text-muted border-top pt-3">
            <Reactions postId={post.id} />{" "}
            <button
              className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
              onClick={() => setModalOpen(true)}
            >
              <FaComment /> Comment
            </button>
            <ShareButton postId={post.id} />
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {modalOpen && (
        <PostModal
          post={post}
          formatDate={formatDate}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default PostCard;
