import { FaSmile, FaGift, FaImage, FaVideo, FaPaperclip } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { motion } from "framer-motion";

function ActionButtons({
  onCancelReply,
  onSubmit,
  disabled,
  themeColor,
  fileInputRef,
  handleFileChange,
  toggleEmojiPicker,
  toggleGifPicker,
}) {
  return (
    <div className="d-flex align-items-center justify-content-between mt-2">
      <div className="d-flex gap-3 align-items-center">
        <FaSmile
          size={18}
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={toggleEmojiPicker}
        />
        <FaGift
          size={18}
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={toggleGifPicker}
        />
        <FaImage
          size={18}
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()}
        />
        <FaVideo
          size={18}
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()}
        />
        <FaPaperclip
          size={16}
          className="text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="d-none"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onCancelReply}
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
          disabled={disabled}
          style={{ background: themeColor, borderColor: themeColor }}
          onClick={onSubmit}
        >
          <RiSendPlaneFill /> Send
        </motion.button>
      </div>
    </div>
  );
}

export default ActionButtons;
