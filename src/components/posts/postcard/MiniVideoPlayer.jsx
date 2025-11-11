import { useRef, useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaTimes,
  FaExpand,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const MiniVideoPlayer = ({
  src,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onClose,
  onExpand,
  onToggleMute,
  isMuted,
  aspectRatio = 16 / 9,
}) => {
  const playerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 320,
    y: window.innerHeight - 180,
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const width = 300;
  const height = width / aspectRatio;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    const boundedX = Math.max(
      10,
      Math.min(window.innerWidth - width - 10, newX)
    );
    const boundedY = Math.max(
      10,
      Math.min(window.innerHeight - height - 10, newY)
    );
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className="mini-video-player position-fixed bg-dark rounded shadow-lg border border-secondary"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown} // drag anywhere
    >
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center p-2 bg-dark bg-opacity-50 rounded-top">
        <button
          className="btn btn-link p-0 text-white"
          onClick={onExpand}
          aria-label="Expand"
        >
          <FaExpand size={12} />
        </button>
        <button
          className="btn btn-link p-0 text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Video */}
      <video
        src={src}
        className="w-100 h-100"
        style={{ objectFit: "cover" }}
        onClick={onPlayPause}
        playsInline
      />

      {/* Bottom Controls */}
      <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-70 p-1">
        {/* Progress Bar */}
        <div
          className="position-relative rounded mb-1"
          style={{
            height: "3px",
            backgroundColor: "rgba(255,255,255,0.3)",
            cursor: "pointer",
          }}
          onClick={onSeek}
        >
          <div
            className="h-100 bg-primary rounded"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Play/Pause + Volume */}
        <div className="d-flex justify-content-between align-items-center px-2">
          <button
            className="btn btn-light btn-sm rounded-circle p-1"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
          </button>
          <button
            className="btn btn-link p-0 text-white"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute size={12} /> : <FaVolumeUp size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniVideoPlayer;
