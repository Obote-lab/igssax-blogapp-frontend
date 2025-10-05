import { NavLink } from "react-router-dom";

function QuickActions({ actions }) {
  return (
    <div className="quick-actions-section">
      <h6 className="section-title">Quick Actions</h6>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <NavLink
            key={index}
            to={action.path}
            className="quick-action-card"
            style={{
              "--action-color": action.color,
              "--action-hover-color": `${action.color}20`,
            }}
          >
            <div
              className="action-icon"
              style={{ backgroundColor: `${action.color}15` }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
            </div>
            <span className="action-text">{action.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
