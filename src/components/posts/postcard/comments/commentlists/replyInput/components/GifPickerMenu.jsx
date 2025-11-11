import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function GifPickerMenu({
  showGifPicker,
  gifs,
  gifSearch,
  handleGifSearch,
  handleSelectGif,
  setShowGifPicker,
  isDark,
}) {
  const gifRef = useRef(null);

  // 🧠 Close GIF picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (gifRef.current && !gifRef.current.contains(event.target)) {
        setShowGifPicker(false);
      }
    }

    if (showGifPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showGifPicker, setShowGifPicker]);

  return (
    <AnimatePresence>
      {showGifPicker && (
        <motion.div
          ref={gifRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute gif-picker ${
            isDark ? "bg-dark text-light" : "bg-white text-dark"
          } p-3 rounded-3 shadow-xl`}
          style={{
            bottom: "70px",
            right: "0",
            width: "320px",
            maxHeight: "350px",
            overflowY: "auto",
            zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
          }}
        >
          <input
            type="text"
            className={`form-control mb-2 ${
              isDark ? "bg-dark text-light border-secondary" : ""
            }`}
            placeholder="Search GIFs..."
            value={gifSearch}
            onChange={(e) => handleGifSearch(e.target.value)}
            style={{
              fontSize: "0.9rem",
              borderRadius: "8px",
            }}
          />

          <div
            className="d-flex flex-wrap gap-2"
            style={{ justifyContent: "center" }}
          >
            {gifs.length > 0 ? (
              gifs.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height_small.url}
                  alt="gif"
                  onClick={() => handleSelectGif(gif)}
                  style={{
                    width: "90px",
                    height: "90px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    objectFit: "cover",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ))
            ) : (
              <p className="text-muted small mt-2">No GIFs found.</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GifPickerMenu;
