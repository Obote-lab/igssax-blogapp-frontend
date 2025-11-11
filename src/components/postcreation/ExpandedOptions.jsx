import { useState } from "react";
import {
  FaCamera,
  FaFilm,
  FaUserTag,
  FaPaperclip,
  FaTimes,
} from "react-icons/fa";

function ExpandedOptions({
  tags,
  onAddTag,
  onRemoveTag,
  mediaFiles,
  onImageUpload,
  onVideoUpload,
  loading,
  onClose,
}) {
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    if (currentTag.trim()) {
      onAddTag(currentTag.trim());
      setCurrentTag("");
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="options-expanded mb-3 p-3 border rounded bg-none position-relative">
      {/* Close Button */}
      <button
        type="button"
        className="btn btn-sm position-absolute top-0 end-0 m-2"
        onClick={onClose}
      >
        <FaTimes />
      </button>

      {/* Media Upload Options */}
      <div className="row g-2 mb-3">
        <div className="col-6">
          <button
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={onImageUpload}
            disabled={loading}
          >
            <FaCamera />
            <span>Add Photos</span>
          </button>
        </div>
        <div className="col-6">
          <button
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={onVideoUpload}
            disabled={loading}
          >
            <FaFilm />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* Tags Input */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-dark">
          Tag Friends
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <FaUserTag className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Type a name and press Enter"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddTag}
            disabled={loading || !currentTag.trim()}
          >
            Add
          </button>
        </div>
      </div>

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="mb-3">
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
      )}

      {/* File Count */}
      {mediaFiles.length > 0 && (
        <div className="text-center text-muted small">
          <FaPaperclip className="me-1" />
          {mediaFiles.length} file(s) selected
        </div>
      )}
    </div>
  );
}

export default ExpandedOptions;
