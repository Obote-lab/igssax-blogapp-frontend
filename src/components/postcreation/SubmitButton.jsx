import { FaSpinner } from "react-icons/fa";

const themeColor = "#73c2be";

function SubmitButton({ post, mediaFiles, loading, onPost }) {
  const canPost = post.trim() || mediaFiles.length > 0;

  return (
    <button
      className={`btn w-100 py-2 fw-semibold ${
        loading || !canPost ? "btn-light text-muted" : "btn-primary"
      }`}
      onClick={onPost}
      disabled={loading || !canPost}
      style={{
        backgroundColor: !canPost ? "#f0f2f5" : themeColor,
        borderColor: themeColor,
      }}
    >
      {loading ? (
        <>
          <FaSpinner className="me-2 spin" />
          Posting...
        </>
      ) : (
        "Post"
      )}
    </button>
  );
}

export default SubmitButton;
