import { FaCog, FaEdit } from "react-icons/fa";

function UserProfile({ user }) {
  return (
    <div className="user-profile-section">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={user?.profile?.avatar || "https://via.placeholder.com/60"}
            alt={user?.first_name}
            className="profile-avatar"
          />
          <div className="online-indicator"></div>
        </div>

        <div className="profile-info">
          <h6 className="profile-name mb-1">
            {user?.first_name} {user?.last_name}
          </h6>
          <small className="profile-username text-muted">
            @{user?.username || user?.first_name?.toLowerCase()}
          </small>
        </div>

        <div className="profile-actions">
          <button className="btn btn-sm btn-light rounded-circle p-1">
            <FaEdit size={12} />
          </button>
          <button className="btn btn-sm btn-light rounded-circle p-1">
            <FaCog size={12} />
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-number">245</div>
          <div className="stat-label">Friends</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1.2K</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">156</div>
          <div className="stat-label">Following</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
