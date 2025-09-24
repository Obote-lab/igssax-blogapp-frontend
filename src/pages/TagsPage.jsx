import { useEffect, useState } from "react";
import { postsAPI } from "../api/axios";
import PostCard from "../components/posts/PostCard";

function TagsPage() {
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await postsAPI.getPosts({ tag });
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch tagged posts:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Browse by Tags</h2>

      <form onSubmit={handleSearch} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Search tag (e.g. music)"
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {posts.length === 0 ? (
        <p className="text-muted">No posts found for this tag.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

export default TagsPage;
