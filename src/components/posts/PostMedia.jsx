import { useState } from "react";
import {
  FaFileAlt,
  FaFilePdf,
  FaMusic,
  FaDownload,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./PostMedia.css";

function PostMedia({ media }) {
  if (!media || media.length === 0) return null;

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevMedia = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const nextMedia = () => {
    setLightboxIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const renderMedia = (mediaItem, index, lightbox = false) => {
    const { id, media_type, file } = mediaItem;

    switch (media_type) {
      case "image":
        return (
          <div
            key={id}
            className={`media-wrapper ${lightbox ? "lightbox" : ""}`}
            onClick={() => !lightbox && openLightbox(index)}
          >
            <img
              src={file}
              alt="post media"
              className="media-content"
              style={{ cursor: lightbox ? "default" : "pointer" }}
            />
          </div>
        );

      case "video":
        return (
          <div
            key={id}
            className={`media-wrapper ${lightbox ? "lightbox" : ""}`}
            onClick={() => !lightbox && openLightbox(index)}
          >
            <video
              controls
              className="media-content"
              style={{ cursor: lightbox ? "default" : "pointer" }}
            >
              <source src={file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div key={id} className="mb-3 p-2 rounded bg-light shadow-sm">
            <audio controls className="w-100">
              <source src={file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div
            key={id}
            className="d-flex align-items-center justify-content-between p-3 mb-2 rounded bg-light shadow-sm"
          >
            <div className="d-flex align-items-center gap-2">
              <FaFilePdf size={20} className="text-danger" />
              <span className="fw-medium">PDF Document</span>
            </div>
            <a href={file} target="_blank" rel="noopener noreferrer" download>
              <FaDownload className="text-muted" />
            </a>
          </div>
        );

      default:
        return (
          <div
            key={id}
            className="d-flex align-items-center justify-content-between p-3 mb-2 rounded bg-light shadow-sm"
          >
            <div className="d-flex align-items-center gap-2">
              <FaFileAlt size={20} className="text-muted" />
              <span className="fw-medium">File</span>
            </div>
            <a href={file} target="_blank" rel="noopener noreferrer" download>
              <FaDownload className="text-muted" />
            </a>
          </div>
        );
    }
  };

  return (
    <div className={`post-media-grid media-count-${media.length}`}>
      {media.map((m, i) => renderMedia(m, i))}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes size={20} />
            </button>
            <button className="lightbox-prev" onClick={prevMedia}>
              <FaChevronLeft size={24} />
            </button>
            <button className="lightbox-next" onClick={nextMedia}>
              <FaChevronRight size={24} />
            </button>
            {renderMedia(media[lightboxIndex], lightboxIndex, true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostMedia;
