import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  FaShieldAlt,
  FaSave,
  FaUserSecret,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";

function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    allowFriendRequests: true,
    showActivityStatus: false,
    allowSearchEngines: false,
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg("Privacy settings saved successfully!");
    // Replace with API call, e.g.:
    // axios.patch("/api/settings/privacy", settings)
  };

  return (
    <div>
      <h4 className="mb-4">
        <FaShieldAlt className="me-2 text-primary" /> Privacy Settings
      </h4>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form
        onSubmit={handleSave}
        className="p-3 border rounded bg-light shadow-sm"
      >
        {/* Profile Visibility */}
        <Form.Check
          type="switch"
          id="profileVisible"
          label={
            <span>
              <FaUserSecret className="me-2 text-secondary" />
              Make my profile visible to others
            </span>
          }
          name="profileVisible"
          checked={settings.profileVisible}
          onChange={handleToggle}
          className="mb-3"
        />

        {/* Friend Requests */}
        <Form.Check
          type="switch"
          id="allowFriendRequests"
          label={
            <span>
              <FaUserFriends className="me-2 text-success" />
              Allow friend requests from anyone
            </span>
          }
          name="allowFriendRequests"
          checked={settings.allowFriendRequests}
          onChange={handleToggle}
          className="mb-3"
        />

        {/* Activity Status */}
        <Form.Check
          type="switch"
          id="showActivityStatus"
          label={
            <span>
              <FaUserSecret className="me-2 text-info" />
              Show my activity status (online/offline)
            </span>
          }
          name="showActivityStatus"
          checked={settings.showActivityStatus}
          onChange={handleToggle}
          className="mb-3"
        />

        {/* Search Engine Discoverability */}
        <Form.Check
          type="switch"
          id="allowSearchEngines"
          label={
            <span>
              <FaSearch className="me-2 text-warning" />
              Allow search engines to index my profile
            </span>
          }
          name="allowSearchEngines"
          checked={settings.allowSearchEngines}
          onChange={handleToggle}
          className="mb-4"
        />

        {/* Save Button */}
        <div className="text-end">
          <Button type="submit" variant="primary">
            <FaSave className="me-2" /> Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default PrivacySettings;
