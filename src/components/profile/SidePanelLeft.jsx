// src/components/profile/SidePanelLeft.jsx
import {
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";

function SidePanelLeft({ user }) {
  const profile = user?.profile || {};

  return (
    <div className="card shadow-sm rounded-4 p-3">
      <h5 className="fw-bold mb-3">Intro</h5>

      {/* Bio */}
      {profile.bio && <p className="text-muted">{profile.bio}</p>}

      {/* Location */}
      {profile.location && (
        <p className="mb-2">
          <FaMapMarkerAlt className="me-2 text-primary" />
          Lives in <strong>{profile.location}</strong>
        </p>
      )}

      {/* Birthday */}
      {profile.birth_date && (
        <p className="mb-2">
          <FaBirthdayCake className="me-2 text-danger" />
          Born on <strong>{profile.birth_date}</strong>
        </p>
      )}

      {/* Website */}
      {profile.website && (
        <p className="mb-2">
          <FaGlobe className="me-2 text-success" />
          <a href={profile.website} target="_blank" rel="noreferrer">
            {profile.website}
          </a>
        </p>
      )}

      {/* Followers / Following */}
      <div className="d-flex justify-content-between mt-3">
        <span>
          <FaUsers className="me-2 text-info" />
          <strong>{profile.followers_count}</strong> Followers
        </span>
        <span>
          <strong>{profile.following_count}</strong> Following
        </span>
      </div>
    </div>
  );
}

export default SidePanelLeft;
