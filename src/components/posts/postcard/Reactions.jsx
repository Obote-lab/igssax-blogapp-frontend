import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { reactionsAPI } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import "./Reactions.css"

function Reactions({ postId }) {
  const [reactions, setReactions] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Fetch reactions
  const fetchReactions = async () => {
    try {
      const { data } = await reactionsAPI.getPostReactions(postId);
      const list = Array.isArray(data) ? data : data.results || [];
      setReactions(list);

      if (currentUser) {
        setHasLiked(list.some((r) => r.user === currentUser.id));
      }
    } catch (err) {
      console.error("Failed to fetch reactions:", err);
    }
  };

  // Toggle Like
  const handleToggleLike = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { data } = await reactionsAPI.toggleReaction({
        reaction_type: "like",
        post: postId,
      });

      if (data?.deleted || data?.action === "removed") {
        setReactions((prev) => prev.filter((r) => r.user !== currentUser.id));
        setHasLiked(false);
      } else {
        const newReaction = data.reaction || data;
        setReactions((prev) => [
          ...prev.filter((r) => r.user !== currentUser.id),
          newReaction,
        ]);
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err?.response?.data || err);
      fetchReactions();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId && currentUser) fetchReactions();
  }, [postId, currentUser]);

  // Summary
  const totalLikes = reactions.filter((r) => r.reaction_type === "like").length;

  return (
    <div className="d-flex justify-content-center mt-2">
      <button
        className={`btn d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm ${
          hasLiked ? "btn-outline-primary active" : "btn-outline-secondary"
        }`}
        onClick={handleToggleLike}
        disabled={loading || !currentUser}
        style={{
          borderRadius: "50px",
          transition: "all 0.2s ease",
          minWidth: "110px",
        }}
      >
        {loading ? (
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <FaThumbsUp
              className="me-1"
              color={hasLiked ? "#0d6efd" : "#6c757d"}
            />
            <span>
              {hasLiked ? "Liked" : "Like"}{" "}
              {totalLikes > 0 && (
                <span className="text-muted small">({totalLikes})</span>
              )}
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export default Reactions;
