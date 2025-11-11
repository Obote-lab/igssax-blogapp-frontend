// components/livestream/StreamDiscovery.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { livestreamAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../ThemeContext";
import { Spinner } from "react-bootstrap";

function StreamDiscovery() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchLiveStreams();
  }, []);

  const fetchLiveStreams = async () => {
    try {
      const response = await livestreamAPI.getLiveStreams();
      setStreams(response.data);
    } catch (error) {
      console.error("Failed to fetch streams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`py-5 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="container text-center">
        {/* Header */}
        <h1 className="fw-bold mb-2">🔴 Live Streams</h1>
        <p className="text-muted mb-4">
          Watch and interact with live broadcasts
        </p>

        {currentUser && (
          <Link to="/live/create" className="btn btn-primary mb-4">
            Start Your Stream
          </Link>
        )}

        {/* Live Streams Grid */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : streams.length > 0 ? (
          <div className="row g-4">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <StreamCard stream={stream} theme={theme} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h4>No live streams at the moment</h4>
            <p className="text-muted">Be the first to go live!</p>
            {currentUser && (
              <Link to="/live/create" className="btn btn-outline-primary mt-2">
                Start Streaming
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StreamCard({ stream, theme }) {
  return (
    <Link
      to={`/live/${stream.id}/watch`}
      className={`card h-100 border-0 text-decoration-none shadow-sm ${
        theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"
      }`}
    >
      {/* Thumbnail */}
      <div className="position-relative">
        <img
          src={stream.thumbnail || "/default-stream-thumbnail.jpg"}
          alt={stream.title}
          className="card-img-top"
          style={{ objectFit: "cover", aspectRatio: "16/9" }}
        />

        <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
          LIVE
        </span>

        <span className="position-absolute bottom-0 start-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded">
          👁️ {stream.viewer_count} watching
        </span>
      </div>

      {/* Info */}
      <div className="card-body d-flex gap-3 align-items-start">
        <img
          src={stream.streamer_info?.avatar}
          alt={stream.streamer_info?.name}
          className="rounded-circle"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />

        <div>
          <h5 className="card-title mb-1 fw-semibold">{stream.title}</h5>
          <p className="mb-0 text-muted small">{stream.streamer_info?.name}</p>
          <p className="mb-0 text-primary small fw-medium">{stream.category}</p>
        </div>
      </div>
    </Link>
  );
}

export default StreamDiscovery;
