// src/components/posts/postcard/InlineMedia.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../ThemeContext";
import {
  MasonryLayout,
  GridLayout,
  ListLayout,
  HeroLayout,
  SideBySideLayout,
  SideBySideVideoLayout,
} from "./mediaStructure/MediaLayouts";
import { useMediaRenderer } from "./mediaStructure/MediaRenderer";
import {
  MEDIA_CLASSIFIER,
  detectMediaType,
} from "./mediaStructure/InlineMediaConfig";

function InlineMedia({
  media = [],
  onMediaClick,
  maxVisible = 8,
  enableAI = true,
}) {
  const { theme } = useTheme();
  const [loadedMedia, setLoadedMedia] = useState(new Set());
  const [intelligentLayout, setIntelligentLayout] = useState("auto");
  const containerRef = useRef(null);

  const isDark = theme === "dark" || theme === "dark-mode";

  const { renderMediaItem } = useMediaRenderer({
    enableAI,
    onMediaClick,
    loadedMedia,
    handleMediaLoad: useCallback((mediaId) => {
      // create a new Set so React re-renders when a media item loads
      setLoadedMedia((prev) => new Set([...prev, mediaId]));
    }, []),
  });

  // Smart Layout Calculator
  const calculateOptimalLayout = useCallback((mediaArray) => {
    if (!mediaArray || mediaArray.length === 0) return "grid";

    const types = mediaArray.map((m) => detectMediaType(m));
    const categories = types.reduce((acc, type) => {
      const category = MEDIA_CLASSIFIER[type]?.category || "file";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Single item: hero for visuals, list for files/docs
    if (mediaArray.length === 1) {
      return ["image", "video"].includes(types[0]) ? "hero" : "list";
    }

    // Two items: special-case two videos, otherwise side-by-side for visuals
    if (mediaArray.length === 2) {
      const bothVideos = types.every((t) => t === "video");
      const bothVisual = types.every((t) => ["image", "video"].includes(t));
      if (bothVideos) return "side-by-side-video";
      if (bothVisual) return "side-by-side";
      return "grid";
    }

    // Three items: hero style if mostly visual
    if (mediaArray.length === 3) {
      if ((categories.visual || 0) >= 2) return "hero";
      return "grid";
    }

    // Four items: balanced grid
    if (mediaArray.length === 4) return "grid";

    // Five or more: masonry for many visuals, list if mostly docs/files
    if (mediaArray.length >= 5) {
      if ((categories.visual || 0) >= 3) return "masonry";
      if (
        (categories.document || 0) + (categories.file || 0) >
        (categories.visual || 0)
      ) {
        return "list";
      }
      return "grid";
    }

    return "grid";
  }, []);

  // Select appropriate layout component
  const getLayoutComponent = useCallback((layoutType) => {
    const components = {
      masonry: MasonryLayout,
      grid: GridLayout,
      list: ListLayout,
      hero: HeroLayout,
      "side-by-side": SideBySideLayout,
      "side-by-side-video": SideBySideVideoLayout,
    };
    return components[layoutType] || GridLayout;
  }, []);

  // Recompute layout when media changes (only if in "auto" mode)
  useEffect(() => {
    if (intelligentLayout === "auto") {
      const layout = calculateOptimalLayout(media);
      setIntelligentLayout(layout);
    }
  }, [media, intelligentLayout, calculateOptimalLayout]);

  const visibleMedia = Array.isArray(media) ? media.slice(0, maxVisible) : [];
  const extraCount = Math.max(0, (media?.length || 0) - maxVisible);
  const mediaTypes = visibleMedia.map((m) => detectMediaType(m));
  const LayoutComponent = getLayoutComponent(intelligentLayout);

  return (
    <div
      ref={containerRef}
      className="inline-media-container position-relative"
      data-layout={intelligentLayout}
      data-media-count={visibleMedia.length}
    >
      <LayoutComponent mediaCount={visibleMedia.length} mediaTypes={mediaTypes}>
        {visibleMedia.map((mediaItem, index) => (
          <div
            key={mediaItem.id || index}
            className="media-item-container"
            data-media-type={detectMediaType(mediaItem)}
            role="group"
            aria-label={`media ${index + 1} of ${visibleMedia.length}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onMediaClick?.(index);
              }
            }}
          >
            {renderMediaItem(mediaItem, index, media)}
          </div>
        ))}
      </LayoutComponent>

      {/* Enhanced More Indicator */}
      {extraCount > 0 && (
        <div className="more-files-indicator position-absolute bottom-3 end-3">
          <button
            className="btn btn-dark btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2"
            onClick={() => onMediaClick?.(maxVisible)}
            aria-label={`Open more media, ${extraCount} items`}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span className="fw-semibold">+{extraCount}</span>
            <small className="opacity-75">more</small>
          </button>
        </div>
      )}

      <style jsx>{`
        .inline-media-container {
          margin: 0.5rem 0;
        }

        .media-item-container {
          transition: transform 0.2s ease;
          outline: none;
        }

        .media-item-container:focus,
        .media-item-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .skeleton-loader {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 0.5rem;
        }

        .file-preview-card {
          background: ${isDark
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.02)"};
          border: 1px solid
            ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)"};
          transition: all 0.2s ease;
        }

        .file-preview-card:hover {
          border-color: ${isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)"};
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        @keyframes loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .media-item-container {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default InlineMedia;
