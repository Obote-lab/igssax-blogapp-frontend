import { Link } from "react-router-dom";
import {
  FaGlobeAmericas,
  FaLock,
  FaUsers,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaImage,
} from "react-icons/fa";
import "./PostHeader.css";

function PostHeader({ author, created_at, privacy, formatDate }) {
  const renderPrivacyIcon = () => {
    switch (privacy?.toLowerCase()) {
      case "public":
        return (
          <FaGlobeAmericas
            className="ms-1 text-muted"
            size={12}
            title="Public"
          />
        );
      case "friends":
        return (
          <FaUsers className="ms-1 text-muted" size={12} title="Friends" />
        );
      case "private":
        return <FaLock className="ms-1 text-muted" size={12} title="Only Me" />;
      default:
        return null;
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `http://127.0.0.1:8000${avatarPath}`;
  };

  const avatarUrl = getAvatarUrl(author?.profile?.avatar);
  const coverUrl = getAvatarUrl(author?.profile?.cover_photo);
  const hasCoverPhoto = !!coverUrl;

  return (
    <div className="post-header-container">
      {/* Main Header */}
      <div className="d-flex align-items-center mb-3">
        <Link
          to={`/profile/${author?.id}`}
          className="post-header-link d-flex align-items-center text-decoration-none text-dark w-100"
        >
          {/* Avatar container */}
          <div className="position-relative">
            {/* Real avatar (visible by default) */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${author?.first_name} ${author?.last_name}`}
                className="post-header-avatar rounded-circle me-3 border border-3 border-white shadow-sm"
                width={56}
                height={56}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
            ) : null}

            {/* Optional fallback initials avatar */}
            <img
              src={`https://ui-avatars.com/api/?name=${author?.first_name}+${author?.last_name}&background=73c2be&color=fff&size=56`}
              alt="Initials avatar"
              className="post-header-avatar rounded-circle me-3 border border-3 border-white shadow-sm"
              width={56}
              height={56}
              style={{ display: avatarUrl ? "none" : "block" }}
            />
          </div>

          {/* User Info (inside same flex row) */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <strong className="fw-bold text-dark post-header-name">
                {author?.first_name} {author?.last_name}
              </strong>
              {author?.is_verified && (
                <FaCheckCircle
                  className="text-primary"
                  size={14}
                  title="Verified"
                />
              )}
            </div>

            <div className="d-flex align-items-center text-muted small gap-2">
              <span>{formatDate(created_at)}</span>
              <span>•</span>
              {renderPrivacyIcon()}
            </div>

            {/* Extra info (hover) */}
            <div className="post-header-extra-info">
              {author?.profile?.location && (
                <div className="d-flex align-items-center gap-1 small">
                  <FaMapMarkerAlt size={10} />
                  <span>{author.profile.location}</span>
                </div>
              )}
              {author?.profile?.work && (
                <div className="d-flex align-items-center gap-1 small">
                  <FaBriefcase size={10} />
                  <span>{author.profile.work}</span>
                </div>
              )}
              {author?.profile?.education && (
                <div className="d-flex align-items-center gap-1 small">
                  <FaGraduationCap size={10} />
                  <span>{author.profile.education}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* User Cover Photo Preview */}
      {hasCoverPhoto && (
        <div className="post-header-cover-preview">
          <img
            src={coverUrl}
            alt={`${author.first_name}'s cover`}
            className="w-100 rounded"
            style={{ height: "120px", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
          <div
            className="w-100 rounded d-none align-items-center justify-content-center"
            style={{
              height: "120px",
              backgroundColor: "#f8f9fa",
              color: "#73c2be",
            }}
          >
            <FaImage size={32} />
            <span className="ms-2 small">Cover photo not available</span>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="post-header-stats">
        <div className="row text-center small">
          <div className="col-4">
            <div className="fw-bold text-primary">
              {author?.profile?.friends_count || 0}
            </div>
            <div className="text-muted">Friends</div>
          </div>
          <div className="col-4">
            <div className="fw-bold text-primary">
              {author?.profile?.followers_count || 0}
            </div>
            <div className="text-muted">Followers</div>
          </div>
          <div className="col-4">
            <div className="fw-bold text-primary">
              {author?.profile?.following_count || 0}
            </div>
            <div className="text-muted">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
