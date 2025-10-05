import { FaTimes } from "react-icons/fa";

function TagsInput({ tags, onRemoveTag }) {
  if (tags.length === 0) return null;

  return (
    <div className="tags-container mb-3">
      <div className="d-flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="badge bg-primary d-flex align-items-center px-2 py-1"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="btn btn-sm p-0 ms-1 text-white"
              style={{ lineHeight: 1 }}
            >
              <FaTimes size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagsInput;
