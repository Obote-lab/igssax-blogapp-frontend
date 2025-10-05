const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "post":
        return "📝";
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      default:
        return "🔔";
    }
  };

  return (
    <div className="recent-activity-section">
      <div className="section-title">Recent Activity</div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-text">
                <strong>{activity.user}</strong> {activity.action}
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
