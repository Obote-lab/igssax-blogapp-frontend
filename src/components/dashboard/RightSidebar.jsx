function RightSidebar() {
  return (
    <div className="p-3">
      {/* Sponsored */}
      <div className="mb-4">
        <h6 className="fw-bold">Sponsored</h6>
        <img
          src="https://via.placeholder.com/250x100"
          alt="sponsored"
          className="img-fluid rounded mb-2"
        />
      </div>

      {/* Birthdays */}
      <div className="mb-4">
        <h6 className="fw-bold">Birthdays</h6>
        <p>🎂 Rigo Juche has a birthday today</p>
      </div>

      {/* Contacts */}
      <div>
        <h6 className="fw-bold">Contacts</h6>
        <ul className="list-unstyled">
          <li className="mb-2 d-flex align-items-center">
            <img
              src="https://via.placeholder.com/30"
              alt="friend"
              className="rounded-circle me-2"
            />
            Alice
          </li>
          <li className="mb-2 d-flex align-items-center">
            <img
              src="https://via.placeholder.com/30"
              alt="friend"
              className="rounded-circle me-2"
            />
            Bob
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RightSidebar;
