import { useEffect, useRef, useState, useCallback } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

function MediaLightbox({
  media,
  currentIndex,
  onClose,
  onNavigate,
  inlineVideoState,
}) {
  const videoRefs = useRef([]);
  const playerRef = useRef(null);
  const progressRef = useRef(null);

  // Enhanced player states
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);
  const [mutedVideos, setMutedVideos] = useState({});
  const [currentTime, setCurrentTime] = useState({});
  const [durations, setDurations] = useState({});
  const [volumes, setVolumes] = useState({});
  const [playbackRates, setPlaybackRates] = useState({});
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoAspectRatios, setVideoAspectRatios] = useState({});

  // Auto-hide controls timer
  const controlsTimerRef = useRef(null);

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize video state from inline player
  useEffect(() => {
    if (currentIndex === null || !media[currentIndex]) return;

    const mediaItem = media[currentIndex];
    if (mediaItem.media_type === "video" && inlineVideoState) {
      const { currentTime, volume, muted, playbackRate, playing } =
        inlineVideoState;

      // Set initial state from inline player
      setCurrentTime((prev) => ({ ...prev, [currentIndex]: currentTime || 0 }));
      setVolumes((prev) => ({ ...prev, [currentIndex]: volume || 1 }));
      setMutedVideos((prev) => ({ ...prev, [currentIndex]: muted || false }));
      setPlaybackRates((prev) => ({
        ...prev,
        [currentIndex]: playbackRate || 1,
      }));

      // Auto-play if it was playing in inline mode
      if (playing) {
        setTimeout(() => {
          toggleVideoPlayback(currentIndex);
        }, 300);
      }
    }
  }, [currentIndex, media, inlineVideoState]);

  // Update progress for current video
  const updateProgress = useCallback((index) => {
    if (videoRefs.current[index]) {
      setCurrentTime((prev) => ({
        ...prev,
        [index]: videoRefs.current[index].currentTime,
      }));
    }
  }, []);

  // Detect aspect ratio
  const detectAspectRatio = useCallback((video, index) => {
    if (video.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight;
      setVideoAspectRatios((prev) => ({ ...prev, [index]: ratio }));
      return ratio;
    }
    return 16 / 9;
  }, []);

  // Event handlers
  const toggleVideoPlayback = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingVideoIndex === index) {
      video.pause();
      setPlayingVideoIndex(null);
    } else {
      // Pause currently playing video
      if (playingVideoIndex !== null) {
        const currentVideo = videoRefs.current[playingVideoIndex];
        if (currentVideo) currentVideo.pause();
      }

      video
        .play()
        .then(() => {
          setPlayingVideoIndex(index);
          resetControlsTimer();
        })
        .catch(console.error);
    }
  };

  const handleSeek = (e, index) => {
    const video = videoRefs.current[index];
    if (video && durations[index]) {
      const progressRect = progressRef.current?.getBoundingClientRect();
      if (!progressRect) return;

      const seekTime =
        ((e.clientX - progressRect.left) / progressRect.width) *
        durations[index];
      video.currentTime = Math.max(0, Math.min(seekTime, durations[index]));
      setCurrentTime((prev) => ({ ...prev, [index]: seekTime }));
    }
  };

  const handleVolumeChange = (index, newVolume) => {
    const video = videoRefs.current[index];
    if (video) {
      video.volume = newVolume;
      setVolumes((prev) => ({ ...prev, [index]: newVolume }));
      setMutedVideos((prev) => ({ ...prev, [index]: newVolume === 0 }));
    }
  };

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !mutedVideos[index];
      setMutedVideos((prev) => ({ ...prev, [index]: !prev[index] }));
    }
  };

  const changePlaybackRate = (index, rate) => {
    const video = videoRefs.current[index];
    if (video) {
      video.playbackRate = rate;
      setPlaybackRates((prev) => ({ ...prev, [index]: rate }));
    }
    setShowSettings(false);
  };

  const skip = (index, seconds) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime += seconds;
      setCurrentTime((prev) => ({
        ...prev,
        [index]: Math.max(
          0,
          Math.min(video.currentTime, durations[index] || 0)
        ),
      }));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Navigation
  const prevMedia = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
    onNavigate(prevIndex);
  };

  const nextMedia = () => {
    const nextIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
    onNavigate(nextIndex);
  };

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (playingVideoIndex !== null) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playingVideoIndex]);

  const handleUserInteraction = () => {
    setShowControls(true);
    resetControlsTimer();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (currentIndex === null) return;

      handleUserInteraction();

      switch (e.key) {
        case "ArrowLeft":
          if (e.altKey) {
            skip(currentIndex, -10);
          } else {
            prevMedia();
          }
          break;
        case "ArrowRight":
          if (e.altKey) {
            skip(currentIndex, 10);
          } else {
            nextMedia();
          }
          break;
        case " ":
          e.preventDefault();
          if (media[currentIndex]?.media_type === "video") {
            toggleVideoPlayback(currentIndex);
          }
          break;
        case "Escape":
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          if (media[currentIndex]?.media_type === "video") {
            toggleMute(currentIndex);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, media, isFullscreen]);

  // Video event listeners
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video || media[currentIndex]?.media_type !== "video") return;

    const handleTimeUpdate = () => updateProgress(currentIndex);
    const handleLoadedMetadata = () => {
      setDurations((prev) => ({ ...prev, [currentIndex]: video.duration }));
      detectAspectRatio(video, currentIndex);

      // Restore volume and playback rate
      if (volumes[currentIndex] !== undefined) {
        video.volume = volumes[currentIndex];
      }
      if (playbackRates[currentIndex] !== undefined) {
        video.playbackRate = playbackRates[currentIndex];
      }
    };

    const handleEnded = () => {
      setPlayingVideoIndex(null);
      setCurrentTime((prev) => ({ ...prev, [currentIndex]: 0 }));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, media, updateProgress, detectAspectRatio]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const renderMedia = (mediaItem, index) => {
    const { id, media_type, file, thumbnail, caption } = mediaItem;
    const progressPercentage = durations[index]
      ? ((currentTime[index] || 0) / durations[index]) * 100
      : 0;

    // FIXED: Use playingVideoIndex instead of isPlaying
    const isVideoPlaying = playingVideoIndex === index;

    switch (media_type) {
      case "image":
        return (
          <div key={id || index} className="lightbox-image-container">
            <img src={file} alt="post media" className="lightbox-image" />
            {caption && (
              <div className="image-caption position-absolute bottom-0 start-0 end-0 p-3 text-white text-center bg-dark bg-opacity-50">
                {caption}
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div
            key={id || index}
            className="lightbox-video-container position-relative"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="lightbox-video"
              poster={thumbnail}
              muted={mutedVideos[index]}
              loop
              onClick={handleUserInteraction}
            >
              <source src={file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Enhanced Video Controls */}
            {/* FIXED: Use isVideoPlaying instead of !isPlaying */}
            {(showControls || !isVideoPlaying) && (
              <div
                className="lightbox-video-controls-overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-between p-4"
                onClick={handleUserInteraction}
              >
                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-start">
                  <button
                    className="btn btn-dark bg-opacity-50 rounded-circle p-2"
                    onClick={onClose}
                  >
                    <FaTimes size={16} />
                  </button>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-dark bg-opacity-50 rounded-circle p-2"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <FaCog size={16} />
                    </button>
                    <button
                      className="btn btn-dark bg-opacity-50 rounded-circle p-2"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <FaCompress size={16} />
                      ) : (
                        <FaExpand size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Center Play Button */}
                {/* FIXED: Use isVideoPlaying instead of isPlaying */}
                {!isVideoPlaying && (
                  <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <button
                      className="btn btn-light bg-opacity-75 rounded-circle p-4 play-button-huge"
                      onClick={() => toggleVideoPlayback(index)}
                    >
                      <FaPlay size={32} className="text-dark" />
                    </button>
                  </div>
                )}

                {/* Bottom Controls */}
                <div className="lightbox-controls-bottom bg-dark bg-opacity-75 rounded p-3">
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    className="progress-bar-container position-relative mb-3"
                    onClick={(e) => handleSeek(e, index)}
                  >
                    <div className="progress-bar-background w-100 h-2 bg-secondary bg-opacity-50 rounded"></div>
                    <div
                      className="progress-bar-fill h-2 bg-primary rounded position-absolute top-0 start-0"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <div
                      className="progress-bar-thumb position-absolute top-50 translate-middle-y bg-white rounded-circle"
                      style={{
                        width: "14px",
                        height: "14px",
                        left: `${progressPercentage}%`,
                      }}
                    ></div>
                  </div>

                  {/* Control Buttons */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <button
                        className="btn btn-link text-white p-2"
                        onClick={() => toggleVideoPlayback(index)}
                      >
                        {isVideoPlaying ? (
                          <FaPause size={20} />
                        ) : (
                          <FaPlay size={20} />
                        )}
                      </button>

                      <button
                        className="btn btn-link text-white p-2"
                        onClick={() => skip(index, -10)}
                      >
                        <FaStepBackward size={16} />
                      </button>

                      <button
                        className="btn btn-link text-white p-2"
                        onClick={() => skip(index, 10)}
                      >
                        <FaStepForward size={16} />
                      </button>

                      <div className="volume-controls d-flex align-items-center gap-2">
                        <button
                          className="btn btn-link text-white p-1"
                          onClick={() => toggleMute(index)}
                        >
                          {mutedVideos[index] || volumes[index] === 0 ? (
                            <FaVolumeMute size={18} />
                          ) : (
                            <FaVolumeUp size={18} />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volumes[index] || 1}
                          onChange={(e) =>
                            handleVolumeChange(
                              index,
                              parseFloat(e.target.value)
                            )
                          }
                          className="volume-slider"
                          style={{ width: "80px" }}
                        />
                      </div>

                      <div className="time-display text-white">
                        {formatTime(currentTime[index] || 0)} /{" "}
                        {formatTime(durations[index] || 0)}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="playback-rate-display text-white small">
                        {playbackRates[index] || 1}x
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Menu */}
            {showSettings && (
              <div className="settings-menu position-absolute top-0 end-0 m-4 mt-5 bg-dark bg-opacity-90 rounded p-3">
                <div className="settings-section mb-3">
                  <h6 className="text-white mb-2">Playback Speed</h6>
                  <div className="d-flex flex-column gap-1">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        className={`btn btn-sm text-start ${
                          playbackRates[currentIndex] === speed
                            ? "btn-primary"
                            : "btn-outline-light"
                        }`}
                        onClick={() => changePlaybackRate(currentIndex, speed)}
                      >
                        {speed}x {speed === 1 ? "Normal" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-section">
                  <h6 className="text-white mb-2">Quality</h6>
                  <div className="d-flex flex-column gap-1">
                    <button className="btn btn-sm btn-outline-light text-start">
                      Auto
                    </button>
                    <button className="btn btn-sm btn-outline-light text-start">
                      1080p
                    </button>
                    <button className="btn btn-sm btn-outline-light text-start">
                      720p
                    </button>
                    <button className="btn btn-sm btn-outline-light text-start">
                      480p
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={id || index} className="text-center text-white">
            <p>Media type not supported in lightbox</p>
          </div>
        );
    }
  };

  if (currentIndex === null) return null;

  return (
    <div
      ref={playerRef}
      className="media-lightbox position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      onClick={handleUserInteraction}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.98)",
        zIndex: 10000,
      }}
    >
      <div
        className="lightbox-content position-relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              className="lightbox-nav lightbox-prev btn btn-dark bg-opacity-50 rounded-circle position-absolute top-50 start-0 translate-middle-y m-4"
              onClick={prevMedia}
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              className="lightbox-nav lightbox-next btn btn-dark bg-opacity-50 rounded-circle position-absolute top-50 end-0 translate-middle-y m-4"
              onClick={nextMedia}
            >
              <FaChevronRight size={24} />
            </button>
          </>
        )}

        {/* Media Container */}
        <div className="lightbox-media-container">
          {renderMedia(media[currentIndex], currentIndex)}
        </div>

        {/* Media Counter */}
        {media.length > 1 && (
          <div className="lightbox-counter position-absolute top-0 start-50 translate-middle-x mt-4 badge bg-dark bg-opacity-75 text-white fs-6">
            {currentIndex + 1} / {media.length}
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        {showControls && (
          <div className="shortcuts-help position-absolute bottom-0 start-50 translate-middle-x mb-4 text-center text-white-50 small">
            <span className="me-3">Space: Play/Pause</span>
            <span className="me-3">←→: Navigate</span>
            <span className="me-3">F: Fullscreen</span>
            <span>M: Mute</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaLightbox;
