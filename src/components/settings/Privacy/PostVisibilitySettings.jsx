import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Alert,
  Badge,
  ButtonGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { FaGlobe, FaUserFriends, FaLock, FaCog, FaSave } from "react-icons/fa";
import { privacyAPI } from "../../../api/axios";

const themeColor = "#73c2be";

function PostVisibilitySettings() {
  const [settings, setSettings] = useState({
    profile_visibility: "public",
    default_post_visibility: "public",
    allow_friend_requests: true,
    allow_follow_requests: true,
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
        profile_visibility: data.profile_visibility,
        default_post_visibility: data.default_post_visibility,
        allow_friend_requests: data.allow_friend_requests,
        allow_follow_requests: data.allow_follow_requests,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load visibility settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await privacyAPI.updateSettings(settings);
      setMessage({
        type: "success",
        text: "Visibility settings updated successfully!",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update settings" });
    } finally {
      setSaving(false);
    }
  };

  const getVisibilityIcon = (type) => {
    switch (type) {
      case "public":
        return <FaGlobe className="text-primary" />;
      case "friends":
        return <FaUserFriends className="text-success" />;
      case "private":
        return <FaLock className="text-secondary" />;
      default:
        return <FaCog />;
    }
  };

  const getVisibilityDescription = (type) => {
    switch (type) {
      case "public":
        return "Visible to everyone";
      case "friends":
        return "Visible to friends only";
      case "private":
        return "Only visible to you";
      default:
        return "Custom visibility";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: themeColor }} />
        <p className="mt-2">Loading visibility settings...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header
          className="border-0 text-white d-flex align-items-center"
          style={{ backgroundColor: themeColor }}
        >
          <FaGlobe className="me-2" />
          <h5 className="mb-0">Profile & Post Visibility</h5>
        </Card.Header>

        <Card.Body>
          {message.text && (
            <Alert variant={message.type === "success" ? "success" : "danger"}>
              {message.text}
            </Alert>
          )}

          {/* Profile Visibility */}
          <div className="mb-4">
            <h6 className="mb-3">Profile Visibility</h6>
            <ButtonGroup className="w-100">
              {["public", "friends", "private"].map((visibility) => (
                <Button
                  key={visibility}
                  variant={
                    settings.profile_visibility === visibility
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      profile_visibility: visibility,
                    }))
                  }
                  className="text-capitalize"
                >
                  {getVisibilityIcon(visibility)}
                  <span className="ms-2">{visibility}</span>
                </Button>
              ))}
            </ButtonGroup>
            <div className="mt-2 text-center">
              <Badge bg="light" text="dark">
                {getVisibilityDescription(settings.profile_visibility)}
              </Badge>
            </div>
          </div>

          {/* Default Post Visibility */}
          <div className="mb-4">
            <h6 className="mb-3">Default Post Visibility</h6>
            <Form.Text className="text-muted mb-2 d-block">
              Set the default visibility for new posts
            </Form.Text>
            <ButtonGroup className="w-100">
              {["public", "friends", "private"].map((visibility) => (
                <Button
                  key={visibility}
                  variant={
                    settings.default_post_visibility === visibility
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      default_post_visibility: visibility,
                    }))
                  }
                  className="text-capitalize"
                >
                  {getVisibilityIcon(visibility)}
                  <span className="ms-2">{visibility}</span>
                </Button>
              ))}
            </ButtonGroup>
            <div className="mt-2 text-center">
              <Badge bg="light" text="dark">
                New posts will be{" "}
                {getVisibilityDescription(
                  settings.default_post_visibility
                ).toLowerCase()}
              </Badge>
            </div>
          </div>

          {/* Connection Settings */}
          <div className="mb-4">
            <h6 className="mb-3">Connection Settings</h6>

            <div className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
              <div>
                <h6 className="mb-1">Allow Friend Requests</h6>
                <small className="text-muted">
                  Let other users send you friend requests
                </small>
              </div>
              <Form.Check
                type="switch"
                checked={settings.allow_friend_requests}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    allow_friend_requests: e.target.checked,
                  }))
                }
              />
            </div>

            <div className="d-flex justify-content-between align-items-center p-3 border rounded">
              <div>
                <h6 className="mb-1">Allow Follow Requests</h6>
                <small className="text-muted">Let other users follow you</small>
              </div>
              <Form.Check
                type="switch"
                checked={settings.allow_follow_requests}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    allow_follow_requests: e.target.checked,
                  }))
                }
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="text-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Visibility Guide */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-light">
          <h6 className="mb-0">Visibility Guide</h6>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <FaGlobe size={24} className="text-primary mb-2" />
              <h6>Public</h6>
              <small className="text-muted">
                Visible to everyone, including search engines
              </small>
            </div>
            <div className="col-md-4 text-center mb-3">
              <FaUserFriends size={24} className="text-success mb-2" />
              <h6>Friends Only</h6>
              <small className="text-muted">
                Only your accepted friends can see
              </small>
            </div>
            <div className="col-md-4 text-center mb-3">
              <FaLock size={24} className="text-secondary mb-2" />
              <h6>Private</h6>
              <small className="text-muted">
                Only you can see this content
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PostVisibilitySettings;
