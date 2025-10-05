import { NavLink } from "react-router-dom";

function MenuSection({ section, themeColor }) {
  const getBadgeVariant = (badge) => {
    if (!badge) return "";
    if (badge === "new") return "badge-new";
    if (badge === "live") return "badge-live";
    if (badge === "pro") return "badge-pro";
    return "badge-default";
  };

  return (
    <div className="menu-section">
      <h6 className="section-title">{section.title}</h6>
      <ul className="menu-list">
        {section.items.map((item, index) => (
          <li key={index} className="menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-link ${isActive ? "menu-link-active" : ""}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? `${themeColor}15` : "transparent",
                borderLeft: isActive
                  ? `3px solid ${themeColor}`
                  : "3px solid transparent",
              })}
            >
              <span className="menu-icon">{item.icon}</span>

              <span className="menu-text">{item.name}</span>

              {item.badge && (
                <span className={`menu-badge ${getBadgeVariant(item.badge)}`}>
                  {item.badge}
                </span>
              )}

              <div className="menu-hover-effect"></div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuSection;
