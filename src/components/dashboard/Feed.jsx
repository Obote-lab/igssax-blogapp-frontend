import { useEffect, useState } from "react";
import { postsAPI } from "../../api/axios";
import CreatePost from "./CreatePost";
import Stories from "./Stories";
import PostCard from "../posts/postcard/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postsAPI.getPosts();
      const fetchedPosts = res.data.results || res.data;
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Called when CreatePost successfully creates a post
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div>
      {/* Create Post Section */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Stories Section */}
      <Stories />

      {/* Posts Section */}
      {loading ? (
        <p className="text-center text-muted mt-4">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p className="text-center text-muted mt-4">
          No posts yet. Be the first 🚀
        </p>
      )}
    </div>
  );
}

export default Feed;
