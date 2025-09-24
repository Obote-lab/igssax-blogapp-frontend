import { useState, useRef } from "react";
import {
  FaSmile,
  FaImage,
  FaVideo,
  FaTag,
  FaTimes,
  FaPaperclip,
  FaSpinner,
} from "react-icons/fa";
import { postsAPI } from "../../api/axios";
import "./CreatePost.css";

function CreatePost({ onPostCreated }) {
  const [post, setPost] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);

  const handlePost = async () => {
    if (!post.trim() && mediaFiles.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();

      // Add text content
      if (post.trim()) {
        formData.append("content", post);
      }

      // Add privacy setting
      formData.append("privacy", privacy);

      // Add media files
      mediaFiles.forEach((file, index) => {
        formData.append(`media_files`, file);
      });

      // Add tags
      if (tags.length > 0) {
        formData.append("tag_names", JSON.stringify(tags));
      }

      // Use the postsAPI from your axios configuration
      await postsAPI.createPost(formData);

      // Reset form
      setPost("");
      setMediaFiles([]);
      setTags([]);
      setCurrentTag("");
      setShowOptions(false);

      // Refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        "Error creating post: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setMediaFiles((prev) => [...prev, ...validFiles]);
    event.target.value = ""; // Reset file input
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags((prev) => [...prev, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const privacyOptions = [
    {
      value: "public",
      label: "🌍 Public",
      description: "Anyone can see this post",
    },
    {
      value: "friends",
      label: "👥 Friends",
      description: "Only your friends can see this",
    },
    {
      value: "only_me",
      label: "🔒 Only Me",
      description: "Only you can see this post",
    },
  ];

  return (
    <div className="card shadow-sm p-3 mb-4 create-post-card">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="rounded-circle me-2"
          width={40}
          height={40}
        />
        <div className="flex-grow-1">
          <strong>You</strong>
          <select
            className="form-select form-select-sm mt-1"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            disabled={loading}
          >
            {privacyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Text Input */}
      <textarea
        className="form-control mb-3"
        placeholder="What's on your mind?"
        value={post}
        onChange={(e) => setPost(e.target.value)}
        disabled={loading}
        rows={3}
        style={{ resize: "none" }}
      />

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="media-preview mb-3">
          <div className="d-flex flex-wrap gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="media-preview-item position-relative">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="rounded"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="video-preview rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#f0f2f5",
                    }}
                  >
                    <FaVideo className="text-muted" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                  style={{ width: "20px", height: "20px", padding: 0 }}
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="tags-container mb-3">
          <div className="d-flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-primary d-flex align-items-center"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
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

      {/* Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-muted">Add to your post</h6>
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="btn btn-sm btn-outline-secondary"
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>
      </div>

      {/* Expanded Options */}
      {showOptions && (
        <div className="options-expanded mb-3 p-3 border rounded">
          {/* Media Upload */}
          <div className="mb-3">
            <label className="btn btn-outline-primary btn-sm me-2">
              <FaImage className="me-1" />
              Photo/Video
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                ref={fileInputRef}
                className="d-none"
                disabled={loading}
              />
            </label>
            <span className="text-muted small">
              {mediaFiles.length} file(s) selected
            </span>
          </div>

          {/* Tags Input */}
          <div className="mb-3">
            <label className="form-label small fw-bold">Add Tags</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text">
                <FaTag />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Add a tag (press Enter)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={addTag}
                disabled={loading || !currentTag.trim()}
              >
                Add
              </button>
            </div>
          </div>

          {/* Privacy Description */}
          <div className="text-muted small">
            <strong>Privacy: </strong>
            {privacyOptions.find((opt) => opt.value === privacy)?.description}
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="d-flex justify-content-around border-top pt-3">
        <button
          type="button"
          className="btn btn-light d-flex align-items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <FaImage style={{ color: "#45bd62" }} />
          Media
        </button>
        <button
          type="button"
          className="btn btn-light d-flex align-items-center gap-2"
          onClick={() => setShowOptions(true)}
          disabled={loading}
        >
          <FaTag style={{ color: "#1877f2" }} />
          Tag
        </button>
        <button
          type="button"
          className="btn btn-light d-flex align-items-center gap-2"
          disabled
        >
          <FaSmile style={{ color: "#f7b928" }} />
          Feeling
        </button>
      </div>

      {/* Submit Button */}
      {(post.trim() || mediaFiles.length > 0) && (
        <button
          className="btn mt-3 w-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#73c2be", color: "#fff" }}
          onClick={handlePost}
          disabled={loading || (!post.trim() && mediaFiles.length === 0)}
        >
          {loading ? (
            <>
              <FaSpinner className="me-2 spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </button>
      )}
    </div>
  );
}

export default CreatePost;
