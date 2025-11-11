import React, { useState } from "react";
import { FaShare } from "react-icons/fa";
import ShareModal from "./ShareModal";

export default function ShareButton({ postId, sharesCount = 0, onShare }) {
  const [showModal, setShowModal] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        className="post-action-btn share-btn d-flex align-items-center gap-2 flex-fill justify-content-center"
        onClick={() => setShowModal(true)}
      >
        <div className="action-icon-wrapper">
          <FaShare className="action-icon" />
        </div>
        <span className="action-label">
          Share
          {sharesCount > 0 && (
            <span className="count-badge">{sharesCount}</span>
          )}
        </span>
      </button>

      {showModal && (
        <ShareModal
          postId={postId}
          onClose={() => setShowModal(false)}
          onShare={handleShare}
        />
      )}
    </>
  );
}
