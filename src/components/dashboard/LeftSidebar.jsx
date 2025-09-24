import { NavLink } from "react-router-dom";
import {
  FaUserFriends,
  FaStore,
  FaUsers,
  FaTv,
  FaClock,
  FaBookmark,
  FaNewspaper,
  FaCalendarAlt,
  FaBullhorn,
  FaBirthdayCake,
  FaFilm,
  FaHistory,
  FaGamepad,
  FaMusic,
  FaBook,
  FaChartLine,
  FaCogs,
  FaEnvelope,
  FaQuestionCircle,
} from "react-icons/fa";

function LeftSidebar() {
  const menuItems = [
    { name: "Friends", icon: <FaUserFriends />, path: "/friends" },
    { name: "Groups", icon: <FaUsers />, path: "/groups" },
    { name: "Marketplace", icon: <FaStore />, path: "/marketplace" },
    { name: "Watch", icon: <FaTv />, path: "/watch" },
    { name: "Memories", icon: <FaClock />, path: "/memories" },
    { name: "Saved", icon: <FaBookmark />, path: "/saved" },
    { name: "Feeds", icon: <FaNewspaper />, path: "/feeds" },
    { name: "Events", icon: <FaCalendarAlt />, path: "/events" },
    { name: "Ads Manager", icon: <FaBullhorn />, path: "/ads-manager" },
    { name: "Birthdays", icon: <FaBirthdayCake />, path: "/birthdays" },
    { name: "Reels", icon: <FaFilm />, path: "/reels" },
    { name: "Recent Events", icon: <FaHistory />, path: "/recent-events" },

    // 🔥 New Additions
    { name: "Games", icon: <FaGamepad />, path: "/games" },
    { name: "Music", icon: <FaMusic />, path: "/music" },
    { name: "Library", icon: <FaBook />, path: "/library" },
    { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
    { name: "Settings", icon: <FaCogs />, path: "/settings" },
    { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    { name: "Help Center", icon: <FaQuestionCircle />, path: "/help" },
  ];

  return (
    <div className="p-3">
      {/* Profile */}
      <div className="d-flex align-items-center mb-4">
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="rounded-circle me-2"
        />
        <strong>Kevin</strong>
      </div>

      {/* Sidebar Links */}
      <ul className="list-unstyled mt-5">
        {menuItems.map((item, idx) => (
          <li key={idx} className="mb-2">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `d-flex align-items-center text-decoration-none fw-medium sidebar-link p-2 rounded ${
                  isActive ? "active-link" : "text-dark"
                }`
              }
            >
              <span className="me-2 sidebar-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* ✅ Custom CSS for hover + active effect */}
      <style>
        {`
          .sidebar-link {
            transition: all 0.2s ease-in-out;
          }
          .sidebar-link:hover {
            color: #73c2be !important;
            transform: translateX(5px) scale(1.05);
          }
          .sidebar-link:hover svg {
            color: #73c2be !important;
            transform: scale(1.2);
          }
          .sidebar-icon svg {
            font-size: 1.5rem;
          }
          /* Active link styling */
          .active-link {
            background-color: #73c2be;
            color: #fff !important;
          }
          .active-link svg {
            color: #fff !important;
          }
        `}
      </style>
    </div>
  );
}

export default LeftSidebar;
