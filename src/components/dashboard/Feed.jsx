import { useEffect, useState } from "react";
import { postsAPI } from "../../api/axios";
import CreatePost from "./CreatePost";
import Stories from "./Stories";
import PostCard from "../posts/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchPosts = async () => {
  try {
    setLoading(true);
    const res = await postsAPI.getPosts();
    // console.log("Fetched posts:", res.data); // 🔍
    setPosts(res.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
};


  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await postsAPI.getPosts();
        // console.log("Fetched posts:", res.data);
        setPosts(res.data.results || res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  return (
    <div>
      {/* Post creation */}
      <CreatePost onPostCreated={fetchPosts} />

      {/* Stories */}
      <Stories />

      {/* Posts */}
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
