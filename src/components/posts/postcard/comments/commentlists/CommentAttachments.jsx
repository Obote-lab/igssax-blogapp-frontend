import { useState } from "react";
import { useTheme } from "../../../../../ThemeContext";

function CommentAttachments({ attachments }) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "dark-mode";
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getMediaType = (attachment) => {
    if (attachment.gif_url) return "gif";
    if (attachment.file) {
      const fileName = attachment.file.toLowerCase();
      if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) return "image";
      if (fileName.match(/\.(mp4|mov|avi|webm|mkv)$/)) return "video";
    }
    return "file";
  };

  const getFileUrl = (attachment) => {
    if (attachment.gif_url) return attachment.gif_url;
    if (attachment.file && typeof attachment.file === "string") {
      return attachment.file;
    }
    if (attachment.file_url) {
      return attachment.file_url;
    }
    return null;
  };

  const openMediaModal = (attachment) => {
    setSelectedMedia(attachment);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="comment-attachments mb-2">
      <div
        className={`attachments-grid ${
          attachments.length > 1 ? "multiple" : "single"
        }`}
      >
        {attachments.map((attachment, index) => {
          const mediaType = getMediaType(attachment);
          const mediaUrl = getFileUrl(attachment);

          if (!mediaUrl) return null;

          return (
            <div key={attachment.id || index} className="attachment-item">
              {mediaType === "image" && (
                <div
                  className="image-attachment rounded cursor-pointer"
                  onClick={() => openMediaModal(attachment)}
                >
                  <img
                    src={mediaUrl}
                    alt="Comment attachment"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      maxWidth: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    className="fallback-text text-muted small"
                    style={{ display: "none" }}
                  >
                    Image not available
                  </div>
                </div>
              )}

              {mediaType === "gif" && (
                <div
                  className="gif-attachment rounded cursor-pointer"
                  onClick={() => openMediaModal(attachment)}
                >
                  <img
                    src={mediaUrl}
                    alt="GIF attachment"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "200px",
                      maxWidth: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    className="fallback-text text-muted small"
                    style={{ display: "none" }}
                  >
                    GIF not available
                  </div>
                  <div className="gif-badge">GIF</div>
                </div>
              )}

              {mediaType === "video" && (
                <div className="video-attachment rounded">
                  <video
                    controls
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      maxWidth: "100%",
                      backgroundColor: isDark ? "#333" : "#f8f9fa",
                    }}
                  >
                    <source src={mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {mediaType === "file" && (
                <div
                  className={`file-attachment p-2 rounded ${
                    isDark ? "bg-dark" : "bg-light"
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-file me-2 text-muted"></i>
                    <div className="file-info">
                      <div
                        className="small text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {attachment.file.split("/").pop()}
                      </div>
                      <div className="text-muted extra-small">
                        File attachment
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={closeMediaModal}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center p-0">
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  onClick={closeMediaModal}
                  aria-label="Close"
                ></button>

                {getMediaType(selectedMedia) === "image" && (
                  <img
                    src={getFileUrl(selectedMedia)}
                    alt="Full size attachment"
                    className="img-fluid"
                    style={{ maxHeight: "80vh", maxWidth: "100%" }}
                  />
                )}

                {getMediaType(selectedMedia) === "gif" && (
                  <img
                    src={getFileUrl(selectedMedia)}
                    alt="Full size GIF"
                    className="img-fluid"
                    style={{ maxHeight: "80vh", maxWidth: "100%" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentAttachments;
