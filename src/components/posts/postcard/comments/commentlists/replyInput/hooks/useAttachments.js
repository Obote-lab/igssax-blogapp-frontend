import { useState, useRef } from "react";

export const useAttachments = () => {
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    attachments,
    setAttachments,
    fileInputRef,
    handleFileChange,
    removeAttachment,
  };
};
