const PostPreview = ({
  post,
  mediaFiles,
  tags,
  privacy,
  onClose,
  themeColor,
}) => {
  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return "🌍";
      case "friends":
        return "👥";
      case "only_me":
        return "🔒";
      default:
        return "🌍";
    }
  };

  return (
    <div className="post-preview">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: themeColor }}>
          Post Preview
        </h6>
        <button
          className="btn-close"
          onClick={onClose}
          style={{ color: themeColor }}
        ></button>
      </div>

      <div className="preview-header">
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px" }}
        />
        <div>
          <div className="fw-bold">You</div>
          <small className="text-muted">
            {getPrivacyIcon(privacy)}{" "}
            {privacy.charAt(0).toUpperCase() + privacy.slice(1)} • Just now
          </small>
        </div>
      </div>

      <div className="preview-content">
        {post || "Your post content will appear here..."}
      </div>

      {mediaFiles.length > 0 && (
        <div className="preview-media">
          <div className="media-preview">
            {mediaFiles.map((file, index) => (
              <div key={index} className="media-preview-item">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="media-preview-image"
                  />
                ) : (
                  <div className="video-preview">
                    <div className="video-icon">🎬</div>
                    <span>Video</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="preview-tags">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="badge me-1"
              style={{ backgroundColor: themeColor }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPreview;
