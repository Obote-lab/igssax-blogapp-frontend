// components/livestream/StreamMainContent/StreamMainContent.jsx
import { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaHeart,
  FaShare,
  FaGift,
  FaPoll,
  FaMusic,
  FaFire,
  FaRegSmile,
  FaPaperPlane,
  FaUser,
  FaCrown,
  FaRobot,
} from "react-icons/fa";
import { useStream } from "../../../context/StreamContext";
import { useAuth } from "../../../context/AuthContext";

function StreamMainContent() {
  const { stream, streamStatus, chatMessages, viewers, userRole } = useStream();

  const { currentUser } = useAuth();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [chatMessage, setChatMessage] = useState("");
  const [activeFeature, setActiveFeature] = useState("poll");
  const videoRef = useRef(null);

  // Mock chat messages
  const mockMessages = [
    {
      id: 1,
      user: "Viewer123",
      message: "Great stream!",
      role: "viewer",
      timestamp: new Date(),
    },
    {
      id: 2,
      user: "StreamFan",
      message: "Love the content! 🔥",
      role: "viewer",
      timestamp: new Date(),
    },
    {
      id: 3,
      user: "Moderator",
      message: "Welcome everyone!",
      role: "moderator",
      timestamp: new Date(),
    },
    {
      id: 4,
      user: "GiftGiver",
      message: "Just subscribed! 🎁",
      role: "subscriber",
      timestamp: new Date(),
    },
  ];

  const displayedMessages = [...mockMessages, ...chatMessages];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Here you would send the message via WebSocket
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

  const handleQuickReaction = (reaction) => {
    // Send reaction via WebSocket
    console.log("Sending reaction:", reaction);
  };

  const interactiveFeatures = {
    poll: {
      title: "Live Poll",
      question: "What's your favorite feature?",
      options: [
        { id: 1, text: "Chat System", votes: 45, percentage: 45 },
        { id: 2, text: "Channel Points", votes: 30, percentage: 30 },
        { id: 3, text: "Sound Alerts", votes: 25, percentage: 25 },
      ],
    },
    giveaway: {
      title: "Giveaway",
      prize: "Custom Emote Pack",
      participants: 127,
      timeLeft: "05:00",
    },
    points: {
      title: "Channel Points",
      balance: 1250,
      rewards: [
        { id: 1, name: "Highlight Message", cost: 300 },
        { id: 2, name: "Sound Alert", cost: 500 },
        { id: 3, name: "Custom Color", cost: 1000 },
      ],
    },
  };

  const getRoleBadge = (role) => {
    const badges = {
      streamer: <span className="badge bg-danger ms-1">STREAMER</span>,
      moderator: <span className="badge bg-warning ms-1">MOD</span>,
      subscriber: <span className="badge bg-success ms-1">SUB</span>,
      viewer: null,
    };
    return badges[role] || badges.viewer;
  };

  return (
    <div className="h-100 d-flex flex-column gap-3">
      {/* Video Player Section */}
      <div className="card border-0 shadow-sm flex-grow-1">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger rounded-pill">LIVE</span>
            <span className="text-white-50">{viewers} viewers</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-light">
              <FaShare className="me-1" />
              Share
            </button>
            <button className="btn btn-sm btn-outline-light">
              <FaExpand />
            </button>
          </div>
        </div>

        <div className="card-body p-0 bg-dark position-relative">
          {/* Video Player Placeholder */}
          <div
            className="w-100 h-100 d-flex align-items-center justify-content-center bg-black"
            style={{ minHeight: "400px", aspectRatio: "16/9" }}
          >
            {streamStatus === "live" ? (
              <div className="text-center text-white">
                <div className="spinner-border text-primary mb-3"></div>
                <h5>Stream is Live</h5>
                <p className="text-white-50">Playing: {stream?.title}</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <FaPlay size={48} className="text-white-50 mb-3" />
                <h5>Stream Offline</h5>
                <p className="text-white-50">The stream will start soon</p>
              </div>
            )}
          </div>

          {/* Video Controls Overlay */}
          <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-75">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>

              <input
                type="range"
                className="form-range flex-grow-1"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                style={{ maxWidth: "100px" }}
              />

              <div className="text-white-50 small">
                {Math.floor(Math.random() * 60)}:
                {(Math.random() * 60).toFixed(0).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Area */}
      <div className="row g-3 flex-grow-1" style={{ minHeight: "300px" }}>
        {/* Left: Interactive Features (5 columns) */}
        <div className="col-lg-5 d-flex flex-column">
          {/* Features Tabs */}
          <div className="card border-0 shadow-sm flex-grow-1">
            <div className="card-header bg-transparent border-bottom-0">
              <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                  <button
                    className={`nav-link btn-sm ${
                      activeFeature === "poll" ? "active" : ""
                    }`}
                    onClick={() => setActiveFeature("poll")}
                  >
                    <FaPoll className="me-1" />
                    Poll
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn-sm ${
                      activeFeature === "giveaway" ? "active" : ""
                    }`}
                    onClick={() => setActiveFeature("giveaway")}
                  >
                    <FaGift className="me-1" />
                    Giveaway
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn-sm ${
                      activeFeature === "points" ? "active" : ""
                    }`}
                    onClick={() => setActiveFeature("points")}
                  >
                    <FaFire className="me-1" />
                    Points
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              {/* Poll Feature */}
              {activeFeature === "poll" && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">
                    {interactiveFeatures.poll.question}
                  </h6>
                  <div className="d-grid gap-2">
                    {interactiveFeatures.poll.options.map((option) => (
                      <button
                        key={option.id}
                        className="btn btn-outline-primary btn-sm text-start position-relative"
                      >
                        <span>{option.text}</span>
                        <span className="position-absolute end-0 top-50 translate-middle-y me-2 badge bg-primary">
                          {option.percentage}%
                        </span>
                        <div
                          className="position-absolute start-0 bottom-0 h-100 bg-primary bg-opacity-25 rounded"
                          style={{ width: `${option.percentage}%`, zIndex: -1 }}
                        ></div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-center text-muted small">
                    {interactiveFeatures.poll.options.reduce(
                      (sum, opt) => sum + opt.votes,
                      0
                    )}{" "}
                    total votes
                  </div>
                </div>
              )}

              {/* Giveaway Feature */}
              {activeFeature === "giveaway" && (
                <div className="text-center">
                  <FaGift size={48} className="text-warning mb-3" />
                  <h6 className="fw-bold text-dark">
                    🎁 {interactiveFeatures.giveaway.prize}
                  </h6>
                  <p className="text-muted mb-2">
                    {interactiveFeatures.giveaway.participants} participants
                  </p>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <div className="fw-bold text-dark">
                      {interactiveFeatures.giveaway.timeLeft}
                    </div>
                    <small className="text-muted">Time Remaining</small>
                  </div>
                  <button className="btn btn-warning btn-sm w-100 mt-3">
                    Enter Giveaway
                  </button>
                </div>
              )}

              {/* Channel Points Feature */}
              {activeFeature === "points" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Channel Points</h6>
                    <span className="badge bg-warning">
                      {interactiveFeatures.points.balance} pts
                    </span>
                  </div>

                  <div className="d-grid gap-2">
                    {interactiveFeatures.points.rewards.map((reward) => (
                      <button
                        key={reward.id}
                        className="btn btn-outline-warning btn-sm d-flex justify-content-between align-items-center"
                      >
                        <span>{reward.name}</span>
                        <span className="badge bg-warning text-dark">
                          {reward.cost} pts
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 p-2 bg-light rounded text-center">
                    <small className="text-muted">
                      Earn points by watching and participating!
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Reactions */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body py-2">
              <div className="d-flex justify-content-around">
                {["🔥", "❤️", "😂", "😮", "😢", "👏"].map((emoji) => (
                  <button
                    key={emoji}
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuickReaction(emoji)}
                    style={{ fontSize: "1.2rem" }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat System (3 columns) */}
        <div className="col-lg-3 d-flex flex-column">
          <div className="card border-0 shadow-sm flex-grow-1">
            <div className="card-header bg-transparent border-bottom-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold text-dark">
                <FaUser className="me-2 text-primary" />
                Live Chat
              </h6>
              <span className="badge bg-primary rounded-pill">
                {displayedMessages.length}
              </span>
            </div>

            <div className="card-body p-0 d-flex flex-column">
              {/* Chat Messages */}
              <div
                className="flex-grow-1 p-3"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {displayedMessages.map((message) => (
                  <div key={message.id} className="mb-2">
                    <div className="d-flex align-items-start gap-2">
                      <div className="flex-shrink-0">
                        <div
                          className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem",
                          }}
                        >
                          <FaUser className="text-primary" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center">
                          <span className="fw-semibold text-dark">
                            {message.user}
                          </span>
                          {getRoleBadge(message.role)}
                          <small className="text-muted ms-2">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                        <p className="mb-0 text-dark">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-top p-3">
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={!chatMessage.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </form>

                {/* Chat Quick Actions */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex gap-1">
                    <button className="btn btn-outline-secondary btn-sm">
                      <FaRegSmile />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <FaGift />
                    </button>
                  </div>
                  <small className="text-muted">Press Enter to send</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Info Bar */}
      <div className="card border-0 shadow-sm">
        <div className="card-body py-2">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h6 className="fw-bold text-dark mb-1">
                {stream?.title || "Stream Title"}
              </h6>
              <p className="text-muted small mb-0">
                {stream?.description || "Stream description will appear here"}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex gap-2 justify-content-end">
                <span className="badge bg-secondary">
                  {stream?.category || "Category"}
                </span>
                <button className="btn btn-outline-primary btn-sm">
                  <FaHeart className="me-1" />
                  Follow
                </button>
                <button className="btn btn-primary btn-sm">
                  <FaCrown className="me-1" />
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamMainContent;
