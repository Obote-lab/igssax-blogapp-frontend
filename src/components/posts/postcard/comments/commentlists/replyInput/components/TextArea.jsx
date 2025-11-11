function TextArea({ replyText, setReplyText, placeholderText, isDark }) {
  return (
    <textarea
      className={`form-control small mb-2 rounded-3 shadow-sm ${
        isDark
          ? "bg-dark text-light border-secondary"
          : "bg-white text-dark border-light"
      }`}
      rows={2}
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder={placeholderText}
      style={{ resize: "none", padding: "0.75rem" }}
    />
  );
}

export default TextArea;
