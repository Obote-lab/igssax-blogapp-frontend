// import PostCard from  "../../dashboard/PostCard"
import PostCard from "../../posts/PostCard";
function TimelineTab({ posts }) {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-muted">No posts yet.</p>;
  }

  return (
    <div className="timeline-tab">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default TimelineTab;
