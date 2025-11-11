// components/livestream/StreamNavbar/StreamAnalytics.jsx
function StreamAnalytics({ viewers, streamStatus, userRole }) {
  if (userRole !== "streamer") return null;

  return (
    <div className="stream-analytics">
      <div className="analytics-pill">
        <span className="analytics-label">Viewers</span>
        <span className="analytics-value">{viewers}</span>
      </div>
    </div>
  );
}

export default StreamAnalytics; // ✅ Add this line
