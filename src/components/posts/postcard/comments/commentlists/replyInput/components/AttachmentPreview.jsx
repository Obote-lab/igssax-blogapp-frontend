import { FaTimes } from "react-icons/fa";

function AttachmentPreview({ attachments, removeAttachment, themeColor }) {
  if (attachments.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 mb-2">
      {attachments.map((file, i) => (
        <div
          key={i}
          className="position-relative rounded-3 overflow-hidden"
          style={{
            width: 70,
            height: 70,
            border: `2px solid ${themeColor}55`,
            background: "#f0f0f0",
          }}
        >
          {file.type === "gif" ? (
            <img
              src={file.url}
              alt="gif"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : file.type?.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : file.type?.startsWith("video/") ? (
            <video
              src={URL.createObjectURL(file)}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-secondary small">
              {file.name}
            </div>
          )}
          <button
            type="button"
            onClick={() => removeAttachment(i)}
            className="btn btn-sm btn-danger position-absolute top-0 end-0 p-1"
            style={{
              borderRadius: "50%",
              transform: "translate(25%, -25%)",
            }}
          >
            <FaTimes size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default AttachmentPreview;
