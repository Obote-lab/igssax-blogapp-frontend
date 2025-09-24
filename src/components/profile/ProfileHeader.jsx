import {
  FaUserPlus,
  FaUserCheck,
  FaEnvelope,
  FaEdit,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaCamera,
  FaUsers,
} from "react-icons/fa";

function ProfileHeader({
  user,
  isOwnProfile = false,
  friendshipStatus,
  onEditProfile,
}) {
  const themeColor = "#73c2be";
  const themeLight = "#a8dfdb";
  const themeDark = "#5a9d99";

  const renderFriendButton = () => {
    switch (friendshipStatus) {
      case "friends":
        return (
          <button
            className="btn d-flex align-items-center gap-2 px-4"
            style={{
              backgroundColor: themeColor,
              color: "white",
              border: "none",
            }}
          >
            <FaUserCheck /> Friends
          </button>
        );
      case "pending":
        return (
          <button
            className="btn btn-outline d-flex align-items-center gap-2 px-4"
            disabled
            style={{
              borderColor: themeColor,
              color: themeColor,
            }}
          >
            <FaUserCheck /> Request Sent
          </button>
        );
      default:
        return (
          <button
            className="btn d-flex align-items-center gap-2 px-4"
            style={{
              backgroundColor: themeColor,
              color: "white",
              border: "none",
            }}
          >
            <FaUserPlus /> Add Friend
          </button>
        );
    }
  };

  return (
    <div
      className="card shadow-lg rounded-4 border-0 overflow-hidden"
      style={{ backgroundColor: "#f8fdfc" }}
    >
      {/* Cover Photo Section */}
      <div
        className="position-relative cover-photo"
        style={{
          height: "320px",
          backgroundImage: `linear-gradient(rgba(115, 194, 190, 0.2), rgba(115, 194, 190, 0.3)), url(${
            user.profile.cover_photo ||
            "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Edit Cover Photo Button (only for own profile) */}
        {isOwnProfile && (
          <button
            className="btn btn-sm position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              color: themeColor,
              border: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            <FaCamera /> Edit Cover
          </button>
        )}

        {/* Avatar Overlay */}
        <div
          className="position-absolute bottom-0 start-0 w-100 pb-4"
          style={{
            background: `linear-gradient(transparent, ${themeColor}40)`,
          }}
        >
          <div className="container">
            <div className="row align-items-end">
              <div className="col-auto">
                <div className="position-relative">
                  <img
                    src={
                      user.profile.avatar ||
                      `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=73c2be&color=fff&size=150`
                    }
                    alt="avatar"
                    className="rounded-circle border border-4 border-white shadow-lg"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  {/* Edit Avatar Button */}
                  {isOwnProfile && (
                    <button
                      className="btn btn-sm rounded-circle position-absolute bottom-0 end-0 border border-3 border-white d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: themeColor,
                        color: "white",
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <FaCamera size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-4">
              <div className="py-4">
                {/* Name and Verification */}
                <div className="d-flex align-items-center gap-3 mb-2">
                  <h2 className="mb-0 fw-bold" style={{ color: "#2c3e50" }}>
                    {user.first_name} {user.last_name}
                  </h2>
                  {user.is_verified && (
                    <FaCheckCircle
                      style={{ color: themeColor }}
                      size={22}
                      title="Verified Account"
                    />
                  )}
                </div>

                {/* Bio */}
                <p className="fs-5 mb-3" style={{ color: "#7f8c8d" }}>
                  {user.profile.bio || "Hello! Welcome to my profile."}
                </p>

                {/* Stats */}
                <div className="d-flex gap-4 mb-3">
                  <div className="text-center">
                    <div className="fw-bold fs-4" style={{ color: themeColor }}>
                      {user.profile.followers_count || 0}
                    </div>
                    <div className="small" style={{ color: "#95a5a6" }}>
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4" style={{ color: themeColor }}>
                      {user.profile.following_count || 0}
                    </div>
                    <div className="small" style={{ color: "#95a5a6" }}>
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold fs-4" style={{ color: themeColor }}>
                      {user.profile.friends_count || 0}
                    </div>
                    <div className="small" style={{ color: "#95a5a6" }}>
                      Friends
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {user.profile.location && (
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ color: themeColor }}
                    >
                      <FaMapMarkerAlt />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                  {user.profile.website && (
                    <div className="d-flex align-items-center gap-2">
                      <FaGlobe style={{ color: themeColor }} />
                      <a
                        href={user.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: themeColor }}
                      >
                        {user.profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-3">
                  {isOwnProfile ? (
                    <>
                      <button
                        className="btn d-flex align-items-center gap-2 px-4"
                        onClick={onEditProfile}
                        style={{
                          backgroundColor: themeColor,
                          color: "white",
                          border: "none",
                        }}
                      >
                        <FaEdit /> Edit Profile
                      </button>
                      <button
                        className="btn d-flex align-items-center gap-2 px-4"
                        style={{
                          backgroundColor: "transparent",
                          color: themeColor,
                          border: `2px solid ${themeColor}`,
                        }}
                      >
                        <FaCamera /> Update Photos
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn d-flex align-items-center gap-2 px-4"
                        style={{
                          backgroundColor: themeColor,
                          color: "white",
                          border: "none",
                        }}
                      >
                        <FaEnvelope /> Message
                      </button>
                      {renderFriendButton()}
                      <button
                        className="btn d-flex align-items-center gap-2 px-4"
                        style={{
                          backgroundColor: "transparent",
                          color: themeColor,
                          border: `2px solid ${themeColor}`,
                        }}
                      >
                        <FaUsers /> Follow
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .cover-photo {
          transition: all 0.3s ease;
        }

        .cover-photo:hover {
          transform: scale(1.01);
        }

        .btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 10px 20px;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(115, 194, 190, 0.4);
        }

        .btn:active {
          transform: translateY(0);
        }

        .rounded-4 {
          border-radius: 1.5rem !important;
        }

        /* Smooth hover effects for interactive elements */
        img:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default ProfileHeader;
