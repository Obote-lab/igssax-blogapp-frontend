const LiveStreams = ({ streams }) => {
  return (
    <div className="live-streams-section">
      <div className="section-title">
        Live Streams
        <a href="/live" className="section-link">
          View All
        </a>
      </div>
      <div className="streams-list">
        {streams.map((stream) => (
          <div key={stream.id} className="stream-card">
            <div className="stream-live-indicator">
              <span>🔴</span> LIVE
            </div>
            <div className="stream-content">
              <div className="stream-header">
                <img
                  src={`https://via.placeholder.com/32`}
                  alt={stream.user}
                  className="stream-avatar"
                />
                <span className="stream-user">{stream.user}</span>
              </div>
              <div className="stream-title">{stream.title}</div>
              <div className="stream-footer">
                <span className="stream-category">{stream.category}</span>
                <span className="stream-viewers">
                  👁️ {stream.viewers.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-view-all">Discover More Streams</button>
    </div>
  );
};

export default LiveStreams;
