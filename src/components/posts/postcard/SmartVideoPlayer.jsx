import { useRef, useState, useCallback, useEffect } from "react";
import VideoControls from "./VideoControls";
import MiniVideoPlayer from "./MiniVideoPlayer";

const SmartVideoPlayer = ({
  src,
  poster,
  onExpand,
  videoIndex = 0,
  totalVideos = 1,
  aspectRatio = 16 / 9,
  objectFit,
  autoPlayOnHover = false,
  height = "280px", // Short height for Facebook-style feed
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Fit mode tuned for short-height cards
  const computedFit = objectFit
    ? objectFit
    : aspectRatio >= 1
    ? "cover"
    : "contain";

  // Card container (Facebook-style)
  const containerStyle = {
    width: "92%",
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    height, // enforce short height
  };

  // Video element fills the card
  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: computedFit,
    display: "block",
  };

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Video play failed:", err);
          setHasError(true);
        });
    }
  }, [isPlaying]);

  const handleSeek = useCallback(
    (e) => {
      if (!videoRef.current || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seekTime = Math.max(0, Math.min(duration, percent * duration));
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    },
    [duration]
  );

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  const toggleMiniPlayer = useCallback(() => {
    setIsMiniPlayer((prev) => !prev);
  }, []);

  const handlePlaybackRateChange = useCallback((rate) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // Auto-hide controls while playing
  useEffect(() => {
    if (!showControls || !isPlaying) return;
    const timer = setTimeout(() => setShowControls(false), 2000);
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  // Pause when mostly out of viewport
  useEffect(() => {
    const handleScroll = () => {
      if (isPlaying && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (
          rect.bottom < window.innerHeight * 0.1 ||
          rect.top > window.innerHeight * 0.9
        ) {
          togglePlay();
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlaying, togglePlay]);

  // Wire video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    video.volume = volume;
    video.playbackRate = playbackRate;

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [volume, playbackRate]);

  const handleMouseEnter = () => {
    setShowControls(true);
    if (autoPlayOnHover && !isPlaying) togglePlay();
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    setShowSettings(false);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (isMiniPlayer) {
    return (
      <MiniVideoPlayer
        src={src}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlay}
        onSeek={handleSeek}
        onClose={toggleMiniPlayer}
        onExpand={onExpand}
        onToggleMute={toggleMute}
        isMuted={isMuted}
        aspectRatio={aspectRatio}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="smart-video-player position-relative"
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={() => setShowControls(true)}
      role="figure"
      aria-label={`Video ${videoIndex + 1} of ${totalVideos}`}
    >
      {/* Video */}
      <video
        ref={videoRef}
        style={videoStyle}
        poster={poster}
        onClick={togglePlay}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Center play overlay when paused */}
      {!isPlaying && !hasError && (
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 2 }}
        >
          <button
            className="btn btn-light rounded-circle p-3 shadow"
            onClick={togglePlay}
            aria-label="Play video"
            style={{ backdropFilter: "blur(6px)" }}
          >
            ▶
          </button>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-75 text-white p-3">
          <div className="text-center">
            <div className="mb-2">⚠️</div>
            <div className="small">Video failed to load</div>
            <button
              className="btn btn-sm btn-outline-light mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {!duration && !hasError && (
        <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center bg-dark bg-opacity-30">
          <div
            className="spinner-border text-light"
            style={{ width: "1.75rem", height: "1.75rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Overlay controls with fade */}
      <div
        className="position-absolute start-0 end-0 bottom-0"
        style={{
          opacity: showControls ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          progressPercentage={progressPercentage}
          onPlayPause={togglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onExpand={onExpand}
          onToggleSettings={toggleSettings}
          onToggleMiniPlayer={toggleMiniPlayer}
          showSettings={showSettings}
          aspectRatio={aspectRatio}
          videoIndex={videoIndex}
          totalVideos={totalVideos}
          showControls={showControls || !isPlaying}
        />
      </div>
    </div>
  );
};

export default SmartVideoPlayer;
