import { useState, useEffect } from "react";
import { Card, Form, Alert, Badge, Spinner } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaClock,
  FaUserClock,
  FaGlobe,
} from "react-icons/fa";
import { privacyAPI } from "../../../api/axios";

const themeColor = "#73c2be";

function ActivityStatusToggle() {
  const [settings, setSettings] = useState({
    show_activity_status: true,
    show_last_seen: true,
    show_online_status: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await privacyAPI.getSettings();
      setSettings({
        show_activity_status: data.show_activity_status,
        show_last_seen: data.show_last_seen,
        show_online_status: data.show_online_status,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load activity settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field, value) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);

    setSaving(true);
    try {
      await privacyAPI.updateSettings(updatedSettings);
      setMessage({ type: "success", text: "Activity settings updated!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update settings" });
      // Revert on error
      setSettings((prev) => ({ ...prev, [field]: !value }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: themeColor }} />
        <p className="mt-2">Loading activity settings...</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header
        className="border-0 text-white d-flex align-items-center"
        style={{ backgroundColor: themeColor }}
      >
        <FaUserClock className="me-2" />
        <h5 className="mb-0">Activity Status & Online Presence</h5>
      </Card.Header>

      <Card.Body>
        {message.text && (
          <Alert variant={message.type === "success" ? "success" : "danger"}>
            {message.text}
          </Alert>
        )}

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-1">
                <FaGlobe className="me-2" style={{ color: themeColor }} />
                Show Online Status
              </h6>
              <small className="text-muted">
                Let others see when you're online
              </small>
            </div>
            <Form.Check
              type="switch"
              checked={settings.show_online_status}
              onChange={(e) =>
                handleToggle("show_online_status", e.target.checked)
              }
              disabled={saving}
            />
          </div>
          <Badge
            bg={settings.show_online_status ? "success" : "secondary"}
            className="ms-4"
          >
            {settings.show_online_status ? "Visible" : "Hidden"}
          </Badge>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-1">
                <FaClock className="me-2" style={{ color: themeColor }} />
                Show Last Seen
              </h6>
              <small className="text-muted">
                Display when you were last active
              </small>
            </div>
            <Form.Check
              type="switch"
              checked={settings.show_last_seen}
              onChange={(e) => handleToggle("show_last_seen", e.target.checked)}
              disabled={saving}
            />
          </div>
          <Badge
            bg={settings.show_last_seen ? "success" : "secondary"}
            className="ms-4"
          >
            {settings.show_last_seen ? "Visible" : "Hidden"}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-1">
                {settings.show_activity_status ? <FaEye /> : <FaEyeSlash />}
                <span className="ms-2">Activity Status</span>
              </h6>
              <small className="text-muted">
                Show your current activity and status updates
              </small>
            </div>
            <Form.Check
              type="switch"
              checked={settings.show_activity_status}
              onChange={(e) =>
                handleToggle("show_activity_status", e.target.checked)
              }
              disabled={saving}
            />
          </div>
          <Badge
            bg={settings.show_activity_status ? "success" : "secondary"}
            className="ms-4"
          >
            {settings.show_activity_status ? "Active" : "Inactive"}
          </Badge>
        </div>

        {saving && (
          <div className="text-center mt-3">
            <Spinner animation="border" size="sm" className="me-2" />
            <small>Saving changes...</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ActivityStatusToggle;
