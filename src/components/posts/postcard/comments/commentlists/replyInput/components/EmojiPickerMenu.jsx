import { useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

function EmojiPickerMenu({
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  isDark,
}) {
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker, setShowEmojiPicker]);

  return (
    <AnimatePresence>
      {showEmojiPicker && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute"
          style={{
            bottom: "60px",
            right: "10px",
            zIndex: 9999,
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={isDark ? "dark" : "light"}
            height={350}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EmojiPickerMenu;
