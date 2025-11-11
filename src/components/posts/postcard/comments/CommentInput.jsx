import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../ThemeContext";

import { useAttachments } from "./commentlists/replyInput/hooks/useAttachments";
import { useGifSearch } from "./commentlists/replyInput/hooks/useGifSearch";
import AvatarSection from "./commentlists/replyInput/components/AvatarSection";
import TextArea from "./commentlists/replyInput/components/TextArea";
import AttachmentPreview from "./commentlists/replyInput/components/AttachmentPreview";
import EmojiPickerMenu from "./commentlists/replyInput/components/EmojiPickerMenu";
import GifPickerMenu from "./commentlists/replyInput/components/GifPickerMenu";
import ActionButtons from "./commentlists/replyInput/components/ActionButtons";

function CommentInput({
  newComment,
  setNewComment,
  handleAddComment,
  currentUser,
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

  const handleEmojiClick = (emojiData) =>
    setNewComment((prev) => prev + emojiData.emoji);

  const handleSelectGif = (gif) => {
    if (gif?.images?.fixed_height?.url) {
      setAttachments((prev) => [
        ...prev,
        { type: "gif", url: gif.images.fixed_height.url },
      ]);
      setShowGifPicker(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() && attachments.length === 0) return;

    const gifAttachments = attachments.filter((a) => a.type === "gif");
    const fileAttachments = attachments.filter((a) => a.type !== "gif");

     handleAddComment({
      content: newComment.trim(),
      attachments: [...fileAttachments, ...gifAttachments],
      });

    setNewComment("");
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

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
      className="comment-input-box d-flex align-items-start gap-2 p-3 rounded-4 shadow-sm"
      style={backgroundStyle}
    >
      <AvatarSection currentUser={currentUser} themeColor={themeColor} />

      <div className="flex-grow-1 position-relative">
        <TextArea
          replyText={newComment}
          setReplyText={setNewComment}
          placeholderText="Write a comment..."
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
          setShowGifPicker={setShowGifPicker}
          isDark={isDark}
        />

        <ActionButtons
          onCancelReply={() => setNewComment("")}
          onSubmit={handleSubmit}
          disabled={!newComment.trim() && attachments.length === 0}
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

export default CommentInput;