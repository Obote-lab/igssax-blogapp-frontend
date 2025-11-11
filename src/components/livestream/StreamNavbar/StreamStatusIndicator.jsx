// components/livestream/StreamNavbar/StreamStatusIndicator.jsx
import { useEffect, useState } from "react";
import { FaEye, FaUsers, FaCircle } from "react-icons/fa";

function StreamStatusIndicator({ status, viewers }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (status === "live") {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusConfig = () => {
    const configs = {
      live: {
        label: "LIVE",
        color: "var(--danger-color)",
        bgColor: "var(--danger-color)",
        textColor: "white",
      },
      offline: {
        label: "OFFLINE",
        color: "var(--text-muted)",
        bgColor: "var(--bg-tertiary)",
        textColor: "var(--text-muted)",
      },
      scheduled: {
        label: "SCHEDULED",
        color: "var(--warning-color)",
        bgColor: "var(--warning-color)",
        textColor: "var(--text-primary)",
      },
      recording: {
        label: "RECORDING",
        color: "var(--accent-color)",
        bgColor: "var(--accent-color)",
        textColor: "white",
      },
    };
    return configs[status] || configs.offline;
  };

  const config = getStatusConfig();

  return (
    <div className="stream-status-indicator">
      <div
        className={`status-badge ${status} ${pulse ? "pulse" : ""}`}
        style={{
          backgroundColor: config.bgColor,
          color: config.textColor,
          border: `2px solid ${config.color}`,
        }}
      >
        <FaCircle className="status-dot" />
        <span className="status-label">{config.label}</span>
      </div>

      {(status === "live" || status === "recording") && (
        <div className="viewer-count">
          <FaEye className="viewer-icon" />
          <span className="viewer-number">
            {viewers?.toLocaleString() || 0}
          </span>
          <span className="viewer-label">viewers</span>
        </div>
      )}
    </div>
  );
}

export default StreamStatusIndicator; // ✅ Add this
