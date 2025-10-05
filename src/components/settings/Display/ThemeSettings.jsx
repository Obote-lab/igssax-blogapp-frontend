import { Card, Row, Col, Badge } from "react-bootstrap";
import { FaSun, FaMoon, FaDesktop, FaPalette, FaCheck } from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";
import { settingsAPI } from "../../../api/axios";
import "./theme.css";

const themeColor = "#73c2be";

function ThemeSettings() {
  const {
    theme,
    setTheme,
    fontSize,
    layoutDensity,
    reducedMotion,
    highContrast,
    colorBlindMode,
    language,
  } = useTheme();

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: FaSun,
      colors: { bg: "#ffffff", text: "#212529", accent: themeColor },
    },
    {
      id: "dark",
      name: "Dark",
      icon: FaMoon,
      colors: { bg: "#1a1d23", text: "#f8f9fa", accent: themeColor },
    },
    {
      id: "system",
      name: "System",
      icon: FaDesktop,
      colors: { bg: "#f8f9fa", text: "#212529", accent: themeColor },
    },
    {
      id: "blue",
      name: "Ocean",
      icon: FaPalette,
      colors: { bg: "#f0f8ff", text: "#1e3a5f", accent: "#3b82f6" },
    },
    {
      id: "green",
      name: "Forest",
      icon: FaPalette,
      colors: { bg: "#f0fff4", text: "#1a4531", accent: "#10b981" },
    },
    {
      id: "purple",
      name: "Royal",
      icon: FaPalette,
      colors: { bg: "#faf5ff", text: "#3730a3", accent: "#8b5cf6" },
    },
  ];

  const getCurrentTheme = () => {
    return themes.find((t) => t.id === theme) || themes[0];
  };

  const handleThemeChange = async (themeId) => {
    // Update theme immediately in context (and localStorage)
    setTheme(themeId);

    // Also save to backend immediately
    try {
      await settingsAPI.updateSettings({
        theme: themeId,
        font_size: fontSize,
        layout_density: layoutDensity,
        reduced_motion: reducedMotion,
        high_contrast: highContrast,
        color_blind_mode: colorBlindMode,
        language: language,
      });
      console.log("Theme saved to backend:", themeId);
    } catch (error) {
      console.error("Failed to save theme to backend:", error);
      // Don't show error to user since theme still changed locally
    }
  };

  return (
    <div>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="border-0 bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Theme Selection</h5>
          <Badge bg="light" text="dark">
            {getCurrentTheme().name}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            {themes.map((themeOption) => {
              const IconComponent = themeOption.icon;
              return (
                <Col md={4} key={themeOption.id} className="mb-3">
                  <div
                    className={`theme-card border rounded-3 p-3 cursor-pointer ${
                      theme === themeOption.id
                        ? "border-primary border-2 active"
                        : "border-light"
                    }`}
                    onClick={() => handleThemeChange(themeOption.id)}
                    style={{
                      backgroundColor: themeOption.colors.bg,
                      color: themeOption.colors.text,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <IconComponent
                        style={{ color: themeOption.colors.accent }}
                      />
                      <span className="ms-2 fw-semibold">
                        {themeOption.name}
                      </span>
                      {theme === themeOption.id && (
                        <FaCheck className="ms-auto text-success" />
                      )}
                    </div>
                    <div className="theme-preview">
                      <div className="d-flex gap-1 mb-1">
                        <div
                          style={{
                            backgroundColor: themeOption.colors.accent,
                            width: "20px",
                            height: "20px",
                            borderRadius: "4px",
                          }}
                        ></div>
                        <div
                          style={{
                            backgroundColor: themeOption.colors.text,
                            width: "20px",
                            height: "20px",
                            borderRadius: "4px",
                            opacity: 0.7,
                          }}
                        ></div>
                        <div
                          style={{
                            backgroundColor: themeOption.colors.bg,
                            width: "20px",
                            height: "20px",
                            borderRadius: "4px",
                            border: `1px solid ${themeOption.colors.text}`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* Debug info - you can remove this later */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-white">
          <h6 className="mb-0">Debug Info</h6>
        </Card.Header>
        <Card.Body>
          <div className="small text-muted">
            <div>
              Current Theme: <strong>{theme}</strong>
            </div>
            <div>
              Document Theme Attribute:{" "}
              <strong>
                {document.documentElement.getAttribute("data-theme")}
              </strong>
            </div>
            <div>
              CSS Variable --bg-primary:{" "}
              <strong>
                {getComputedStyle(document.documentElement)
                  .getPropertyValue("--bg-primary")
                  .trim()}
              </strong>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ThemeSettings;
