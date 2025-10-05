import { FaHeart, FaComment, FaShare, FaUserPlus } from "react-icons/fa";

function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "like",
      user: "Sarah Johnson",
      action: "liked your post",
      time: "2 min ago",
      icon: <FaHeart className="text-danger" />,
      userAvatar: "https://via.placeholder.com/32",
    },
    {
      id: 2,
      type: "comment",
      user: "Mike Chen",
      action: "commented on your photo",
      time: "5 min ago",
      icon: <FaComment className="text-info" />,
      userAvatar: "https://via.placeholder.com/32",
    },
    {
      id: 3,
      type: "share",
      user: "Emma Davis",
      action: "shared your story",
      time: "15 min ago",
      icon: <FaShare className="text-success" />,
      userAvatar: "https://via.placeholder.com/32",
    },
    {
      id: 4,
      type: "follow",
      user: "Alex Rodriguez",
      action: "started following you",
      time: "1 hour ago",
      icon: <FaUserPlus className="text-primary" />,
      userAvatar: "https://via.placeholder.com/32",
    },
  ];

  return (
    <div className="activity-feed">
      <h6 className="section-title">Recent Activity</h6>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-avatar">
              <img src={activity.userAvatar} alt={activity.user} />
              <div className="activity-icon">{activity.icon}</div>
            </div>
            <div className="activity-content">
              <p className="activity-text mb-0">
                <strong>{activity.user}</strong> {activity.action}
              </p>
              <small className="activity-time">{activity.time}</small>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-view-all">View All Activity</button>
    </div>
  );
}

export default ActivityFeed;
