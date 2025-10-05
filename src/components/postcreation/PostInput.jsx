function PostInput({ user, post, setPost, loading }) {
  return (
    <div className="mb-3">
      <textarea
        className="form-control post-input border-0"
        placeholder={`What's on your mind, ${user?.first_name}?`}
        value={post}
        onChange={(e) => setPost(e.target.value)}
        disabled={loading}
        rows={3}
      />
    </div>
  );
}

export default PostInput;
