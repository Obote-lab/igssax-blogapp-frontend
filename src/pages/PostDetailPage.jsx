import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postsAPI } from "../api/axios";
import PostCard from "../components/posts/postcard/PostCard";
import Comments from "../components/posts/postcard/comments/Comments";

function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await postsAPI.getPost(postId);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Post Details</h2>
      <PostCard post={post} />
      <div className="mt-4">
        <Comments postId={post.id} formatDate={formatDate} />
      </div>
    </div>
  );
}

export default PostDetailPage;
