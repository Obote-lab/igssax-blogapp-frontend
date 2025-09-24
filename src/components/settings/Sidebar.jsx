import { NavLink } from "react-router-dom";
import {
  FaUserCog,
  FaLock,
  FaBell,
  FaDesktop,
  FaShieldAlt,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const links = [
    { to: "account", icon: <FaUserCog />, label: "Account" },
    { to: "privacy", icon: <FaLock />, label: "Privacy" },
    { to: "notifications", icon: <FaBell />, label: "Notifications" },
    { to: "display", icon: <FaDesktop />, label: "Display" },
    { to: "security", icon: <FaShieldAlt />, label: "Security" },
  ];

  return (
    <div className="settings-sidebar shadow-sm rounded-3 p-3">
      <h6 className="fw-bold text-uppercase text-muted mb-3">Settings</h6>
      <div className="list-group">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `list-group-item list-group-item-action d-flex align-items-center gap-2 py-2 ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
