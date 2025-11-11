import { useRef, useState, useEffect, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaStepBackward,
  FaStepForward,
  FaTimes,
} from "react-icons/fa";

const InlineVideoPlayer = ({ src, poster, onExpand }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Update progress
  const updateProgress = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  }, []);

  // Event handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && duration) {
      const seekTime =
        (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSettings(false);
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Draggable functionality
  const handleDragStart = (e) => {
    if (!isDraggable) return;
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setIsDraggable(true);
    }
  };

  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, [updateProgress, volume]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className={`inline-video-player position-relative ${
        isMinimized ? "minimized" : ""
      } ${isDragging ? "dragging" : ""}`}
      style={{
        cursor: isDraggable ? "move" : "default",
        transform: isMinimized
          ? `translate(${playerPosition.x}px, ${playerPosition.y}px)`
          : "none",
        zIndex: isMinimized ? 1000 : "auto",
        position: isMinimized ? "fixed" : "relative",
        width: isMinimized ? "300px" : "100%",
        bottom: isMinimized ? "20px" : "auto",
        right: isMinimized ? "20px" : "auto",
      }}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-100 h-100 object-fit-cover rounded"
        poster={poster}
        onClick={togglePlay}
        style={{ cursor: "pointer" }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      {(showControls || !isPlaying) && (
        <div className="video-controls-overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-between p-3">
          {/* Top Controls */}
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex gap-2">
              {isMinimized && (
                <button
                  className="btn btn-sm btn-dark bg-opacity-75 rounded-circle"
                  onClick={toggleMinimize}
                  title="Restore"
                >
                  <FaCompress size={12} />
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-dark bg-opacity-75 rounded-circle"
                onClick={toggleMinimize}
                title={isMinimized ? "Restore" : "Minimize"}
              >
                {isMinimized ? (
                  <FaCompress size={12} />
                ) : (
                  <FaCompress size={12} />
                )}
              </button>
              <button
                className="btn btn-sm btn-dark bg-opacity-75 rounded-circle"
                onClick={onExpand}
                title="Expand"
              >
                <FaExpand size={12} />
              </button>
            </div>
          </div>

          {/* Center Play Button */}
          {!isPlaying && (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <button
                className="btn btn-light bg-opacity-75 rounded-circle p-3"
                onClick={togglePlay}
              >
                <FaPlay size={24} />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="controls-bottom bg-dark bg-opacity-75 rounded p-2">
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="progress-bar-container position-relative mb-2"
              style={{
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
              onClick={handleSeek}
            >
              <div
                className="progress-bar-fill h-100 bg-primary rounded"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="progress-bar-thumb position-absolute top-50 translate-middle-y bg-white rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  left: `${progressPercentage}%`,
                  display: showControls ? "block" : "none",
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="d-flex justify-content-between align-items-center">
              {/* Left Controls */}
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-link text-white p-1"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <button
                  className="btn btn-link text-white p-1"
                  onClick={() => skip(-10)}
                  title="Rewind 10s"
                >
                  <FaStepBackward />
                </button>

                <button
                  className="btn btn-link text-white p-1"
                  onClick={() => skip(10)}
                  title="Forward 10s"
                >
                  <FaStepForward />
                </button>

                <div className="volume-controls d-flex align-items-center gap-1">
                  <button
                    className="btn btn-link text-white p-1"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute />
                    ) : (
                      <FaVolumeUp />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    style={{ width: "60px" }}
                  />
                </div>

                <div className="time-display text-white small">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="d-flex align-items-center">
                <div className="settings-dropdown position-relative">
                  <button
                    className="btn btn-link text-white p-1"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <FaCog />
                  </button>

                  {showSettings && (
                    <div className="settings-menu position-absolute bottom-100 end-0 mb-2 bg-dark bg-opacity-90 rounded p-2">
                      <div className="settings-section mb-2">
                        <div className="text-white small mb-1">
                          Playback Speed
                        </div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            className={`btn btn-sm d-block w-50 text-start text-white ${
                              playbackRate === speed ? "bg-primary" : ""
                            }`}
                            onClick={() => changePlaybackRate(speed)}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      <div className="settings-section">
                        <div className="text-white small mb-1">Quality</div>
                        <button className="btn btn-sm d-block w-100 text-start text-white">
                          Auto
                        </button>
                        <button className="btn btn-sm d-block w-100 text-start text-white">
                          1080p
                        </button>
                        <button className="btn btn-sm d-block w-100 text-start text-white">
                          720p
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!duration && (
        <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineVideoPlayer;
