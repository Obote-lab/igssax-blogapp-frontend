import { Card, Badge, Button } from "react-bootstrap";
import { FaEye, FaBell, FaCog } from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";

const themeColor = "#73c2be";

function LivePreview() {
  const { theme, fontSize, layoutDensity } = useTheme();

  const themes = {
    light: { bg: "#ffffff", text: "#212529", accent: themeColor },
    dark: { bg: "#1a1d23", text: "#f8f9fa", accent: themeColor },
    system: { bg: "#f8f9fa", text: "#212529", accent: themeColor },
    blue: { bg: "#f0f8ff", text: "#1e3a5f", accent: "#3b82f6" },
    green: { bg: "#f0fff4", text: "#1a4531", accent: "#10b981" },
    purple: { bg: "#faf5ff", text: "#3730a3", accent: "#8b5cf6" },
  };

  const currentTheme = themes[theme] || themes.light;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="border-0 bg-white">
        <h5 className="mb-0">
          <FaEye className="me-2" style={{ color: themeColor }} />
          Live Preview
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center mb-4">
          <p className="text-muted">
            This preview shows how your settings will affect the application's
            appearance.
          </p>
        </div>

        <div
          className="preview-container border rounded-3 p-4 mx-auto"
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            fontSize: `${fontSize}px`,
            maxWidth: "400px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Preview Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: currentTheme.accent,
                }}
              ></div>
              <div>
                <h6
                  className="mb-0"
                  style={{
                    color: currentTheme.accent,
                    fontSize: `${fontSize}px`,
                  }}
                >
                  John Doe
                </h6>
                <small>Online now</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <FaBell style={{ color: currentTheme.text, opacity: 0.7 }} />
              <FaCog style={{ color: currentTheme.text, opacity: 0.7 }} />
            </div>
          </div>

          {/* Preview Content */}
          <div className="mb-4">
            <div className="d-flex gap-2 mb-3">
              <Badge style={{ backgroundColor: currentTheme.accent }}>
                Featured
              </Badge>
              <Badge bg="secondary">New</Badge>
            </div>

            <div
              className="border rounded p-3 mb-3"
              style={{
                borderColor: currentTheme.text + "20",
                padding: layoutDensity === "compact" ? "12px" : "16px",
              }}
            >
              <h6 style={{ fontSize: `${fontSize + 2}px` }}>
                Sample Post Title
              </h6>
              <p className="mb-2" style={{ fontSize: `${fontSize}px` }}>
                This is a sample post showing how your content will appear with
                the current theme and typography settings.
              </p>
              <small className="text-muted">Posted 2 hours ago</small>
            </div>

            <div className="d-flex justify-content-between">
              <Button
                size="sm"
                style={{
                  backgroundColor: currentTheme.accent,
                  borderColor: currentTheme.accent,
                  fontSize: `${fontSize - 2}px`,
                }}
              >
                Like
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: `${fontSize - 2}px` }}
              >
                Comment
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: `${fontSize - 2}px` }}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Preview Footer */}
          <div
            className="border-top pt-3"
            style={{ borderColor: currentTheme.text + "20" }}
          >
            <small className="text-muted">
              Current settings: {theme} theme, {fontSize}px font,{" "}
              {layoutDensity} layout
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LivePreview;
