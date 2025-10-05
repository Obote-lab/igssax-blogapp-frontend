import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";

const Sidebar = ({ themeColor }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const menuItems = [
    {
      path: "/settings/account",
      icon: "👤",
      label: "Account",
      description: "Personal information",
    },
    {
      path: "/settings/privacy",
      icon: "🔒",
      label: "Privacy",
      description: "Data and privacy settings",
    },
    {
      path: "/settings/notifications",
      icon: "🔔",
      label: "Notifications",
      description: "Alerts and messages",
    },
    {
      path: "/settings/display",
      icon: "🎨",
      label: "Display",
      description: "Theme and appearance",
    },
    {
      path: "/settings/security",
      icon: "🛡️",
      label: "Security",
      description: "Password and 2FA",
    },
    {
      path: "/settings/social",
      icon: "🌐",
      label: "Social",
      description: "Connections and sharing",
    },
    {
      path: "/settings/billing",
      icon: "💳",
      label: "Billing",
      description: "Payments and subscriptions",
    },
    {
      path: "/settings/accessibility",
      icon: "♿",
      label: "Accessibility",
      description: "Access needs",
    },
    {
      path: "/settings/advanced",
      icon: "⚙️",
      label: "Advanced",
      description: "Developer options",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar-sticky">
      <div
        className="card shadow-sm border-0 rounded-4"
        style={{
          overflow: "hidden",
        }}
      >
        <div
          className="card-header border-0 text-center py-4"
          style={{
            background: `linear-gradient(45deg, ${themeColor}, ${themeColor}dd)`,
            color: "white",
          }}
        >
          <h5 className="mb-0 fw-bold">Settings Menu</h5>
        </div>

        <div className="card-body p-0">
          <Nav variant="pills" className="flex-column">
            {menuItems.map((item) => (
              <Nav.Item key={item.path}>
                <Nav.Link
                  onClick={() => navigate(item.path)}
                  className="p-3 border-0 rounded-0"
                  style={{
                    backgroundColor: isActive(item.path)
                      ? `${themeColor}15`
                      : "transparent",
                    color: isActive(item.path)
                      ? themeColor
                      : "var(--text-secondary)",
                    borderLeft: isActive(item.path)
                      ? `3px solid ${themeColor}`
                      : "3px solid transparent",
                    borderBottom: "1px solid var(--border-light)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = `${themeColor}08`;
                      e.target.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span
                      className="fs-5 me-3"
                      style={{
                        width: "30px",
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    <div className="flex-grow-1">
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {item.label}
                      </div>
                      <small
                        className="d-block"
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.7,
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.description}
                      </small>
                    </div>
                    {isActive(item.path) && (
                      <div
                        className="rounded-circle"
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: themeColor,
                        }}
                      />
                    )}
                  </div>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {/* Quick Actions */}
        <div
          className="card-footer border-0"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="text-center">
            <small className="text-muted d-block mb-2">Quick Actions</small>
            <div className="d-grid gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                style={{
                  borderColor: themeColor,
                  color: themeColor,
                }}
                onClick={() => navigate("/profile")}
              >
                View Profile
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
                onClick={() => navigate("/help")}
              >
                Get Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
