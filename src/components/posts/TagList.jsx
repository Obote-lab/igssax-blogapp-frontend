function TagList({ tags = [] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-3">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="badge bg-primary me-1"
          style={{ cursor: "pointer" }}
          onClick={() => console.log(`Clicked tag: ${tag.name}`)}
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

export default TagList;
