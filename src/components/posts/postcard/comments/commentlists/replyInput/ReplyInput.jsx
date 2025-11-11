import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../../../ThemeContext";

import { useAttachments } from "./hooks/useAttachments";
import { useGifSearch } from "./hooks/useGifSearch";
import AvatarSection from "./components/AvatarSection";
import TextArea from "./components/TextArea";
import AttachmentPreview from "./components/AttachmentPreview";
import EmojiPickerMenu from "./components/EmojiPickerMenu";
import GifPickerMenu from "./components/GifPickerMenu";
import ActionButtons from "./components/ActionButtons";

function ReplyInput({
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
  currentUser,
  replyingTo,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "dark-mode";
  const themeColor = isDark ? "#73c2be" : "#0d6efd";

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const {
    attachments,
    setAttachments,
    fileInputRef,
    handleFileChange,
    removeAttachment,
  } = useAttachments();
  const { gifs, gifSearch, handleGifSearch } = useGifSearch();

  // Add emoji to text
  const handleEmojiClick = (emojiData) =>
    setReplyText((prev) => prev + emojiData.emoji);

  // Add GIF to attachments with type "gif"
  const handleSelectGif = (gif) => {
    if (gif?.images?.fixed_height?.url) {
      setAttachments((prev) => [
        ...prev,
        { type: "gif", url: gif.images.fixed_height.url },
      ]);
      setShowGifPicker(false);
    }
  };

  // Handle submit: separate GIFs from normal files
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!replyText.trim() && attachments.length === 0) {
      console.warn("⚠️ Reply text and attachments are empty, skipping submit.");
      return;
    }

    const gifAttachments = attachments.filter((a) => a.type === "gif");
    const fileAttachments = attachments.filter((a) => a.type !== "gif");

    // DEBUG: log the payload
    console.group("🧾 ReplyInput Payload");
    console.log("Text:", replyText);
    console.log("File attachments:", fileAttachments);
    console.log("GIF attachments:", gifAttachments);
    console.groupEnd();

    // Call parent submit function
    onSubmitReply({
      text: replyText.trim(),
      attachments: [...fileAttachments, ...gifAttachments],
    });

    // Reset state
    setReplyText("");
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const placeholderText = replyingTo
    ? `💬 Reply to ${replyingTo}...`
    : "Type your reply...";

  const backgroundStyle = {
    background: isDark
      ? "linear-gradient(135deg, #1a1a1a, #2b2b2b)"
      : "linear-gradient(135deg, #fdfdfd, #f2f7ff)",
    border: `1px solid ${isDark ? "#444" : "#ccc"}`,
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="reply-input-box d-flex align-items-start gap-2 mt-2 p-3 rounded-4 shadow-sm"
      style={backgroundStyle}
    >
      <AvatarSection currentUser={currentUser} themeColor={themeColor} />

      <div className="flex-grow-1 position-relative">
        <TextArea
          replyText={replyText}
          setReplyText={setReplyText}
          placeholderText={placeholderText}
          isDark={isDark}
        />

        <AttachmentPreview
          attachments={attachments}
          removeAttachment={removeAttachment}
          themeColor={themeColor}
        />

        <EmojiPickerMenu
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          handleEmojiClick={handleEmojiClick}
          isDark={isDark}
        />

        <GifPickerMenu
          showGifPicker={showGifPicker}
          gifs={gifs}
          gifSearch={gifSearch}
          handleGifSearch={handleGifSearch}
          handleSelectGif={handleSelectGif}
          isDark={isDark}
        />

        <ActionButtons
          onCancelReply={onCancelReply}
          onSubmit={handleSubmit}
          disabled={!replyText.trim() && attachments.length === 0}
          themeColor={themeColor}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          toggleEmojiPicker={() => {
            setShowEmojiPicker((p) => !p);
            setShowGifPicker(false);
          }}
          toggleGifPicker={() => {
            setShowGifPicker((p) => !p);
            setShowEmojiPicker(false);
          }}
        />
      </div>
    </motion.form>
  );
}

export default ReplyInput;
