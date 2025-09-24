import { useEffect, useState } from "react";
import { postsAPI } from "../api/axios";
import PostCard from "../components/posts/PostCard";

function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await postsAPI.getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">News Feed</h2>
      {posts.length === 0 ? (
        <p className="text-muted">No posts available.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

export default PostsPage;
