import Comments from "./Comments";
import Reactions from "./Reactions";
import ShareButton from "./ShareButton";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import TagList from "./TagList";

function PostModal({ post, formatDate, onClose }) {
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
              formatDate={formatDate}
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

            {/* Divider */}
            <hr className="my-3" />

            {/* Action Bar (Reactions + Share) */}
            <div className="d-flex justify-content-around align-items-center mb-3">
              <Reactions postId={post.id} />
              <Comments postId={post.id} formatDate={formatDate} />
              <ShareButton postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
