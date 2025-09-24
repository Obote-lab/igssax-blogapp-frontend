// src/components/profile/tabs/FriendsTab.jsx
import { FaUserCircle } from "react-icons/fa";

function FriendsTab({ userId }) {
  // Placeholder data, replace with API call later
  const friends = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
  ];

  if (friends.length === 0) {
    return <p className="text-center text-muted">No friends yet.</p>;
  }

  return (
    <div className="friends-tab">
      <h5 className="fw-bold mb-3">Friends</h5>
      <div className="row">
        {friends.map((friend) => (
          <div key={friend.id} className="col-6 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3">
              <FaUserCircle size={50} className="text-muted mb-2" />
              <strong>{friend.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsTab;
