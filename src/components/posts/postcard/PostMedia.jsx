import { useState } from "react";
import InlineMedia from "./InlineMedia";
import MediaLightbox from "./MediaLightbox";

function PostMedia({ media }) {
  if (!media || media.length === 0) return null;

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      <InlineMedia media={media} onMediaClick={openLightbox} />

      <MediaLightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={(index) => setLightboxIndex(index)}
      />
    </>
  );
}

export default PostMedia;
