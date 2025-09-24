// src/components/profile/SidePanelRight.jsx
import { FaUserCircle, FaUserPlus } from "react-icons/fa";

function SidePanelRight({ user }) {
  // Placeholder suggested friends — replace with API call later
  const suggestions = [
    { id: 2, name: "Alice Johnson", mutual: 5 },
    { id: 3, name: "Bob Smith", mutual: 2 },
    { id: 4, name: "Charlie Brown", mutual: 8 },
  ];

  return (
    <div className="card shadow-sm rounded-4 p-3">
      <h5 className="fw-bold mb-3">People You May Know</h5>
      <ul className="list-unstyled">
        {suggestions.map((s) => (
          <li
            key={s.id}
            className="d-flex align-items-center justify-content-between mb-3"
          >
            <div className="d-flex align-items-center">
              <FaUserCircle size={40} className="text-muted me-2" />
              <div>
                <strong>{s.name}</strong>
                <p className="small text-muted mb-0">
                  {s.mutual} mutual friends
                </p>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-primary">
              <FaUserPlus className="me-1" />
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidePanelRight;
