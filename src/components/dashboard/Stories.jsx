import { useRef, useState, useEffect } from "react";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./theme.css"

function Stories() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const stories = [
    { id: 1, type: "create", name: "Create story" },
    {
      id: 2,
      name: "Joyous Jacob",
      image: "https://via.placeholder.com/150x250",
      profile: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Fredrick Ouma",
      image: "https://via.placeholder.com/150x250",
      profile: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Tales Extra",
      image: "https://via.placeholder.com/150x250",
      profile: "https://via.placeholder.com/40",
    },
    {
      id: 5,
      name: "Tales Oluoch",
      image: "https://via.placeholder.com/150x250",
      profile: "https://via.placeholder.com/40",
    },
    {
      id: 6,
      name: "New Story",
      image: "https://via.placeholder.com/150x250",
      profile: "https://via.placeholder.com/40",
    },
  ];

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateArrows();
    container.addEventListener("scroll", updateArrows);

    return () => container.removeEventListener("scroll", updateArrows);
  }, []);

  return (
    <div className="position-relative mb-4">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="btn btn-light rounded-circle shadow position-absolute top-50 start-0 translate-middle-y"
          style={{ zIndex: 2 }}
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Stories Container */}
      <div
        ref={scrollRef}
        className="d-flex gap-2 overflow-auto px-5"
        style={{ scrollbarWidth: "none" }}
      >
        {stories.map((story) =>
          story.type === "create" ? (
            <div
              key={story.id}
              className="card shadow-sm"
              style={{ width: "120px", height: "200px", flex: "0 0 auto" }}
            >
              <div
                className="d-flex flex-column justify-content-center align-items-center h-100"
                style={{ background: "#f0f2f5" }}
              >
                <div className="custom-primary-bg rounded-circle p-2 mb-2 text-white">
                  <FaPlus />
                </div>
                <span className="fw-medium text-center small">
                  {story.name}
                </span>
              </div>
            </div>
          ) : (
            <div
              key={story.id}
              className="card text-white"
              style={{
                width: "120px",
                height: "200px",
                flex: "0 0 auto",
                backgroundImage: `url(${story.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Profile Bubble */}
              <img
                src={story.profile}
                alt="profile"
                className="rounded-circle border border-2 custom-primary-border"
                width={35}
                height={35}
                style={{ position: "absolute", top: "10px", left: "10px" }}
              />
              {/* Name */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  right: "10px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                {story.name}
              </div>
            </div>
          )
        )}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="btn btn-light rounded-circle shadow position-absolute top-50 end-0 translate-middle-y"
          style={{ zIndex: 2 }}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}

export default Stories;
