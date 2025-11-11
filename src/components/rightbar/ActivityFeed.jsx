import {
  FaHeart,
  FaComment,
  FaShare,
  FaUserPlus,
  FaEllipsisH,
} from "react-icons/fa";
import "./ActivityFeed.css"

function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "like",
      user: "Sarah Johnson",
      action: "liked your post",
      time: "2 min ago",
      icon: <FaHeart className="text-danger" />,
      userAvatar: "https://via.placeholder.com/40",
      postPreview: "Great meeting everyone at the conference!",
    },
    {
      id: 2,
      type: "comment",
      user: "Mike Chen",
      action: "commented on your photo",
      time: "5 min ago",
      icon: <FaComment className="text-info" />,
      userAvatar: "https://via.placeholder.com/40",
      comment: "Amazing shot! 📸",
    },
    {
      id: 3,
      type: "share",
      user: "Emma Davis",
      action: "shared your story",
      time: "15 min ago",
      icon: <FaShare className="text-success" />,
      userAvatar: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      type: "follow",
      user: "Alex Rodriguez",
      action: "started following you",
      time: "1 hour ago",
      icon: <FaUserPlus className="text-primary" />,
      userAvatar: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="activity-feed">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold mb-0 text-dark">Recent Activity</h6>
        <span className="badge bg-primary rounded-pill">4 new</span>
      </div>

      <div className="d-flex flex-column gap-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="card border-0 shadow-sm activity-card"
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-start gap-3">
                {/* Avatar with status indicator */}
                <div className="position-relative">
                  <img
                    src={activity.userAvatar}
                    alt={activity.user}
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1">
                    <div className="activity-icon-wrapper">{activity.icon}</div>
                  </div>
                </div>

                {/* Activity content */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <div>
                      <p className="mb-1">
                        <span className="fw-semibold text-dark">
                          {activity.user}
                        </span>
                        <span className="text-muted"> {activity.action}</span>
                      </p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary border-0">
                      <FaEllipsisH size={12} />
                    </button>
                  </div>

                  {/* Additional content based on activity type */}
                  {activity.postPreview && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-muted">
                        {activity.postPreview}
                      </small>
                    </div>
                  )}

                  {activity.comment && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-dark">"{activity.comment}"</small>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-2 d-flex gap-2">
                    {activity.type === "follow" && (
                      <>
                        <button className="btn btn-sm btn-primary px-3 rounded-pill">
                          Follow back
                        </button>
                        <button className="btn btn-sm btn-outline-secondary px-3 rounded-pill">
                          Remove
                        </button>
                      </>
                    )}
                    {(activity.type === "like" ||
                      activity.type === "comment") && (
                      <button className="btn btn-sm btn-outline-primary px-3 rounded-pill">
                        View post
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-3">
        <button className="btn btn-outline-primary btn-sm rounded-pill px-4">
          View All Activity
        </button>
      </div>
    </div>
  );
}

export default ActivityFeed;
