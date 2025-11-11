// components/livestream/StreamNavbar/StreamControls.jsx
import { useState } from "react";
import {
  FaBroadcastTower,
  FaStop,
  FaRocket,
  FaCalendar,
  FaCog,
  FaVideo,
} from "react-icons/fa";

function StreamControls({
  streamStatus,
  onStartStream,
  onEndStream,
  userRole,
  streamId,
  mobile = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartStream = async () => {
    if (!streamId) return;
    setIsLoading(true);
    try {
      await onStartStream(streamId);
    } catch (error) {
      console.error("Failed to start stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndStream = async () => {
    if (!streamId) return;
    setIsLoading(true);
    try {
      await onEndStream(streamId);
    } catch (error) {
      console.error("Failed to end stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show controls to streamers and moderators
  if (!["streamer", "moderator"].includes(userRole)) {
    return (
      <div className="stream-controls-viewer">
        <button className="btn btn-outline-accent btn-sm">
          <FaVideo className="me-1" />
          Follow Stream
        </button>
      </div>
    );
  }

  return (
    <div className={`stream-controls ${mobile ? "mobile" : ""}`}>
      {streamStatus === "offline" && (
        <>
          <button
            className="btn btn-accent start-stream-btn"
            onClick={handleStartStream}
            disabled={isLoading}
          >
            <FaBroadcastTower className="me-2" />
            {isLoading ? "Starting..." : "Start Stream"}
          </button>

          <button className="btn btn-outline-accent">
            <FaRocket className="me-2" />
            Go Live
          </button>

          <button className="btn btn-outline-accent">
            <FaCalendar className="me-2" />
            Schedule
          </button>
        </>
      )}

      {(streamStatus === "live" || streamStatus === "recording") && (
        <>
          <button
            className="btn btn-danger stop-stream-btn"
            onClick={handleEndStream}
            disabled={isLoading}
          >
            <FaStop className="me-2" />
            {isLoading ? "Ending..." : "End Stream"}
          </button>

          <button className="btn btn-outline-accent">
            <FaRocket className="me-2" />
            Raid
          </button>
        </>
      )}

      {streamStatus === "scheduled" && (
        <>
          <button className="btn btn-warning">
            <FaBroadcastTower className="me-2" />
            Start Now
          </button>

          <button className="btn btn-outline-accent">
            <FaCalendar className="me-2" />
            Reschedule
          </button>
        </>
      )}

      <button className="btn btn-outline-accent settings-btn">
        <FaCog className="me-2" />
        Settings
      </button>
    </div>
  );
}

export default StreamControls; // ✅ Add this
