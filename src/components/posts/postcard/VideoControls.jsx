import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";

const VideoControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  progressPercentage,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onExpand,
  showControls = false,
}) => {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!showControls) return null;

  return (
    <div
      className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-70 p-2"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Progress Bar */}
      <div
        className="position-relative mb-2 rounded"
        style={{
          height: "4px",
          backgroundColor: "rgba(255,255,255,0.3)",
          cursor: "pointer",
        }}
        onClick={onSeek}
        aria-label="Seek video"
      >
        <div
          className="h-100 bg-primary rounded"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Control Row */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          {/* Play/Pause */}
          <button
            className="btn btn-link p-0 text-white"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>

          {/* Time Display */}
          <span className="text-white small">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Volume */}
          <button
            className="btn btn-link p-0 text-white ms-2"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <FaVolumeMute size={14} />
            ) : (
              <FaVolumeUp size={14} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={onVolumeChange}
            className="form-range"
            style={{ width: "70px", height: "4px" }}
            aria-label="Volume"
          />
        </div>

        {/* Expand Button */}
        <button
          className="btn btn-link p-0 text-white"
          onClick={onExpand}
          aria-label="Expand video"
        >
          <FaExpand size={16} />
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
