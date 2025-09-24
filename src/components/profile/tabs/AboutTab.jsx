// src/components/profile/tabs/AboutTab.jsx
import {
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaGlobe,
  FaUser,
} from "react-icons/fa";

function AboutTab({ user }) {
  const profile = user?.profile || {};

  return (
    <div className="about-tab">
      <h5 className="fw-bold mb-3">About</h5>
      <ul className="list-group list-group-flush">
        {profile.bio && (
          <li className="list-group-item">
            <FaUser className="me-2 text-primary" />
            {profile.bio}
          </li>
        )}
        {profile.location && (
          <li className="list-group-item">
            <FaMapMarkerAlt className="me-2 text-danger" />
            Lives in {profile.location}
          </li>
        )}
        {profile.birth_date && (
          <li className="list-group-item">
            <FaBirthdayCake className="me-2 text-warning" />
            Born on {profile.birth_date}
          </li>
        )}
        {profile.website && (
          <li className="list-group-item">
            <FaGlobe className="me-2 text-success" />
            <a href={profile.website} target="_blank" rel="noreferrer">
              {profile.website}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default AboutTab;
