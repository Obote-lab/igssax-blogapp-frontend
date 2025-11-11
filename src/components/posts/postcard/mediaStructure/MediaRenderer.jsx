import React, { useCallback } from "react";
import {
  MEDIA_CLASSIFIER,
  detectMediaType,
  getMediaIcon,
} from "./InlineMediaConfig";
import SmartVideoPlayer from "../SmartVideoPlayer";

export const useMediaRenderer = (options = {}) => {
  const {
    enableAI = true,
    onMediaClick,
    loadedMedia,
    handleMediaLoad,
  } = options;

  const renderSmartImage = useCallback(
    (mediaItem, index) => {
      const isLoaded = loadedMedia?.has(mediaItem.id || index);

      return (
        <div
          key={mediaItem.id || index}
          className="smart-image-wrapper position-relative rounded-3 overflow-hidden h-100"
          onClick={() => onMediaClick?.(index)}
          style={{ cursor: "pointer" }}
        >
          {!isLoaded && (
            <div className="skeleton-loader position-absolute w-100 h-100" />
          )}

          <img
            src={mediaItem.file}
            alt={mediaItem.alt || "Post media"}
            className={`smart-image w-100 h-100 object-fit-cover transition-all ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => handleMediaLoad?.(mediaItem.id || index)}
            style={{ transition: "opacity 0.3s ease" }}
          />

          {enableAI && isLoaded && (
            <div className="position-absolute top-0 start-0 m-2">
              <span className="badge bg-dark bg-opacity-75 text-white small">
                AI Vision
              </span>
            </div>
          )}
        </div>
      );
    },
    [loadedMedia, handleMediaLoad, onMediaClick, enableAI]
  );

  const renderSmartVideo = useCallback(
    (mediaItem, index, totalVideos) => (
      <div key={mediaItem.id || index} className="smart-video-wrapper h-100">
        <SmartVideoPlayer
          src={mediaItem.file}
          poster={mediaItem.thumbnail}
          onExpand={() => onMediaClick?.(index)}
          videoIndex={index}
          totalVideos={totalVideos}
          aspectRatio={mediaItem.aspectRatio}
          enableAI={enableAI}
        />
      </div>
    ),
    [onMediaClick, enableAI]
  );

  const renderFilePreview = useCallback((mediaItem, mediaType) => {
    const fileExt = mediaItem.file?.split(".").pop()?.toLowerCase();
    const config = MEDIA_CLASSIFIER[mediaType] || MEDIA_CLASSIFIER.unknown;
    const IconComponent = config.icons?.[fileExt] || config.icon;

    return (
      <div className="file-preview-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between">
        <div className="file-header text-center">
          <IconComponent
            size={32}
            className="mb-2"
            style={{ color: config.color }}
          />
          <div className="file-name small fw-bold text-truncate">
            {mediaItem.name || `file.${fileExt}`}
          </div>
          <div className="file-type x-small text-muted text-uppercase">
            {fileExt}
          </div>
        </div>

        <div className="file-actions d-flex gap-1 justify-content-center">
          <a
            href={mediaItem.file}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{
              backgroundColor: config.color,
              color: "white",
              border: "none",
            }}
            download
          >
            Open
          </a>
        </div>
      </div>
    );
  }, []);

  const renderMediaItem = useCallback(
    (mediaItem, index, mediaArray) => {
      const mediaType = MEDIA_CLASSIFIER[mediaItem.media_type]
        ? mediaItem.media_type
        : Object.keys(MEDIA_CLASSIFIER).find((type) =>
            MEDIA_CLASSIFIER[type].types?.includes(
              mediaItem.file?.split(".").pop()?.toLowerCase()
            )
          ) || "unknown";

      switch (mediaType) {
        case "image":
          return renderSmartImage(mediaItem, index);
        case "video":
          const totalVideos = mediaArray.filter(
            (m) =>
              MEDIA_CLASSIFIER[m.media_type]?.category === "visual" ||
              MEDIA_CLASSIFIER[
                Object.keys(MEDIA_CLASSIFIER).find((type) =>
                  MEDIA_CLASSIFIER[type].types?.includes(
                    m.file?.split(".").pop()?.toLowerCase()
                  )
                )
              ]?.category === "visual"
          ).length;
          return renderSmartVideo(mediaItem, index, totalVideos);
        default:
          return renderFilePreview(mediaItem, mediaType);
      }
    },
    [renderSmartImage, renderSmartVideo, renderFilePreview]
  );

  return { renderMediaItem };
};
