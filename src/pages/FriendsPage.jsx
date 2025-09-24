import { useEffect, useState } from "react";
import { friendsAPI } from "../api/axios";

function FriendsPage() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await friendsAPI.list();
        setFriends(data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Friends</h2>
      {friends.length === 0 ? (
        <p className="text-muted">You don’t have any friends yet.</p>
      ) : (
        <ul className="list-group">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {friend.first_name} {friend.last_name}
              <span className="badge bg-primary rounded-pill">
                {friend.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendsPage;
