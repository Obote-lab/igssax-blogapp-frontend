import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { reactionsAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; // Correct import

function Reactions({ postId }) {
  const [reactions, setReactions] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth(); // Use the hook

  // Fetch reactions for this post
  const fetchReactions = async () => {
    try {
      const { data } = await reactionsAPI.getPostReactions(postId);
      const list = Array.isArray(data) ? data : data.results || [];
      setReactions(list);

      // Check if current user has reacted
      if (currentUser) {
        setHasLiked(list.some((r) => r.user === currentUser.id));
      }
    } catch (err) {
      console.error("Failed to fetch reactions:", err);
    }
  };

  // Toggle like/unlike
  const handleToggleLike = async () => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const { data } = await reactionsAPI.toggleReaction({
        reaction_type: "like",
        post: postId,
      });

      // Optimistic UI update based on API response
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
      fetchReactions(); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId && currentUser) {
      fetchReactions();
    }
  }, [postId, currentUser]);

  // Get unique reaction counts by type
  const reactionSummary = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {});

  const totalReactions = Object.values(reactionSummary).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <button
      className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
      onClick={handleToggleLike}
      disabled={loading || !currentUser}
      style={{
        backgroundColor: hasLiked ? "#e3f2fd" : "#f8f9fa",
        borderColor: hasLiked ? "#2196f3" : "#dee2e6",
        color: hasLiked ? "#1976d2" : "#6c757d",
        transition: "all 0.2s ease",
      }}
    >
      <FaThumbsUp color={hasLiked ? "#2196f3" : "#6c757d"} />
      <span>
        {hasLiked ? "Liked" : "Like"}
        {totalReactions > 0 && ` (${totalReactions})`}
      </span>
      {loading && (
        <div className="spinner-border spinner-border-sm ms-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </button>
  );
}

export default Reactions;
