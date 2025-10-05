import { FaUserPlus, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

function SuggestedConnections() {
  const suggestions = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "AI Researcher at TechCorp",
      location: "San Francisco, CA",
      mutual: 12,
      avatar: "https://via.placeholder.com/48",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "Creative Director",
      location: "New York, NY",
      mutual: 8,
      avatar: "https://via.placeholder.com/48",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "Senior Developer",
      location: "Austin, TX",
      mutual: 15,
      avatar: "https://via.placeholder.com/48",
    },
  ];

  return (
    <div className="suggested-connections">
      <h6 className="section-title">People You May Know</h6>
      <div className="connections-list">
        {suggestions.map((person) => (
          <div key={person.id} className="connection-card">
            <img
              src={person.avatar}
              alt={person.name}
              className="connection-avatar"
            />
            <div className="connection-info">
              <h6 className="connection-name">{person.name}</h6>
              <div className="connection-details">
                <div className="connection-detail">
                  <FaBriefcase className="me-1" />
                  <span>{person.title}</span>
                </div>
                <div className="connection-detail">
                  <FaMapMarkerAlt className="me-1" />
                  <span>{person.location}</span>
                </div>
                <div className="mutual-connections">
                  {person.mutual} mutual connections
                </div>
              </div>
            </div>
            <button className="btn-connect">
              <FaUserPlus className="me-1" />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedConnections;
