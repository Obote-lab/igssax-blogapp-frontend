const OnlineFriends = ({ friends }) => {
  return (
    <div className="online-friends-section">
      <div className="section-title">Online Friends ({friends.length})</div>
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="friend-avatar"
            />
            <span className="friend-name">{friend.name}</span>
            <div
              className={`friend-status ${
                friend.status === "online" ? "status-online" : "status-away"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineFriends;
