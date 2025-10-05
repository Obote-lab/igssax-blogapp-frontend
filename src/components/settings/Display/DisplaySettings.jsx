import { useState } from "react";
import { Card, Tab, Nav, Button, Alert, Spinner } from "react-bootstrap";
import {
  FaPalette,
  FaFont,
  FaUniversalAccess,
  FaEye,
  FaSave,
} from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";
import { settingsAPI } from "../../../api/axios";
import ThemeSettings from "./ThemeSettings";
import TypographySettings from "./TypographySettings";
import AccessibilitySettings from "./AccessibilitySettings";
import LivePreview from "./LivePreview";

const themeColor = "#73c2be";

function DisplaySettings() {
  const [activeTab, setActiveTab] = useState("theme");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const theme = useTheme(); // This now has refreshSettings function

  const tabs = [
    {
      key: "theme",
      title: "Theme & Colors",
      icon: <FaPalette />,
      component: <ThemeSettings />,
    },
    {
      key: "typography",
      title: "Typography & Layout",
      icon: <FaFont />,
      component: <TypographySettings />,
    },
    {
      key: "accessibility",
      title: "Accessibility",
      icon: <FaUniversalAccess />,
      component: <AccessibilitySettings />,
    },
    {
      key: "preview",
      title: "Live Preview",
      icon: <FaEye />,
      component: <LivePreview />,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.updateSettings({
        theme: theme.theme,
        font_size: theme.fontSize,
        layout_density: theme.layoutDensity,
        reduced_motion: theme.reducedMotion,
        high_contrast: theme.highContrast,
        color_blind_mode: theme.colorBlindMode,
        language: theme.language,
      });

      // Refresh the theme context to ensure it's in sync with backend
      await theme.refreshSettings();

      setMessage({
        type: "success",
        text: "Display settings saved successfully!",
      });
    } catch (error) {
      console.error("Save error:", error);
      setMessage({
        type: "error",
        text: "Failed to save display settings",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <FaPalette className="me-2" style={{ color: themeColor }} />
          <h4 style={{ color: themeColor, margin: 0 }}>Display & Appearance</h4>
        </div>
        <Button
          onClick={handleSave}
          style={{ backgroundColor: themeColor, borderColor: themeColor }}
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {message.text && (
        <Alert variant={message.type === "success" ? "success" : "danger"}>
          {message.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="px-3 pt-3">
              {tabs.map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    eventKey={tab.key}
                    className={`d-flex align-items-center ${
                      activeTab === tab.key ? "fw-bold" : ""
                    }`}
                    style={{
                      color: activeTab === tab.key ? themeColor : "#6c757d",
                      borderBottom:
                        activeTab === tab.key
                          ? `2px solid ${themeColor}`
                          : "none",
                    }}
                  >
                    <span className="me-2">{tab.icon}</span>
                    {tab.title}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="p-4">
              {tabs.map((tab) => (
                <Tab.Pane key={tab.key} eventKey={tab.key}>
                  {tab.component}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DisplaySettings;
