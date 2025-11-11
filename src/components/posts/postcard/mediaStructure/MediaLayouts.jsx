import React from "react";
import "./MediaLayouts.css"; 

export const MasonryLayout = ({ children }) => (
  <div className="masonry-grid">{children}</div>
);

export const GridLayout = ({ children, mediaCount }) => {
  const getGridColumns = () => {
    if (mediaCount === 1) return "1fr";
    if (mediaCount === 2) return "repeat(2, minmax(280px, 1fr))";
    if (mediaCount === 3) return "repeat(3, minmax(200px, 1fr))";
    if (mediaCount === 4) return "repeat(2, minmax(240px, 1fr))";
    return "repeat(auto-fit, minmax(180px, 1fr))";
  };

  return (
    <div
      className="grid-layout"
      style={{ gridTemplateColumns: getGridColumns() }}
    >
      {children}
    </div>
  );
};

// List Layout - Perfect for documents and files
export const ListLayout = ({ children }) => (
  <div className="list-layout">{children}</div>
);

// Hero Layout - First item large, others small
export const HeroLayout = ({ children }) => {
  const [firstItem, ...restItems] = React.Children.toArray(children);

  return (
    <div className="hero-layout">
      <div className="hero-main">{firstItem}</div>
      {restItems.length > 0 && (
        <div className="hero-secondary">{restItems}</div>
      )}
    </div>
  );
};

// Side-by-Side Layout - for images/videos
export const SideBySideLayout = ({ children }) => (
  <div className="side-by-side-layout">{children}</div>
);

// Side-by-Side Video Layout - special case for 2 videos
export const SideBySideVideoLayout = ({ children }) => (
  <div className="side-by-side-video-layout">{children}</div>
);
