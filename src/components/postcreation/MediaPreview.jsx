import { FaTimes, FaVideo } from "react-icons/fa";

function MediaPreview({ mediaFiles, onRemoveMedia }) {
  if (mediaFiles.length === 0) return null;

  return (
    <div className="media-preview mb-3">
      <div className="d-flex flex-wrap gap-2">
        {mediaFiles.map((file, index) => (
          <div key={index} className="media-preview-item">
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="media-preview-image"
              />
            ) : (
              <div className="video-preview">
                <FaVideo className="video-icon" />
                <span>Video</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemoveMedia(index)}
              className="remove-media-button"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaPreview;
