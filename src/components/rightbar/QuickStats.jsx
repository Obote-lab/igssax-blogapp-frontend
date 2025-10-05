import { FaEye, FaHeart, FaShare, FaComment } from "react-icons/fa";

function QuickStats() {
  const stats = [
    { icon: <FaEye />, label: "Profile Views", value: "1.2K", change: "+12%" },
    { icon: <FaHeart />, label: "Likes Received", value: "456", change: "+8%" },
    { icon: <FaComment />, label: "Comments", value: "189", change: "+15%" },
    { icon: <FaShare />, label: "Shares", value: "67", change: "+5%" },
  ];

  return (
    <div className="quick-stats">
      <h6 className="section-title">Your Stats</h6>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change positive">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickStats;
