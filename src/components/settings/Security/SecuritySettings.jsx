import { useState } from "react";
import { Form, Card, Button, Table, Alert, Badge } from "react-bootstrap";
import {
  FaLock,
  FaShieldAlt,
  FaKey,
  FaExclamationTriangle,
  FaSave,
  FaSignOutAlt,
} from "react-icons/fa";

function SecuritySettings() {
  const [twoFA, setTwoFA] = useState(false);
  const [alertLogins, setAlertLogins] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Mock active sessions
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Nairobi, Kenya",
      lastActive: "2025-09-23 12:30 PM",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Mombasa, Kenya",
      lastActive: "2025-09-21 9:10 AM",
      current: false,
    },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg("Security settings updated successfully!");
    // TODO: Replace with API call
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setSuccessMsg("Password updated successfully!");
    // TODO: API call: axios.post("/api/settings/change-password", passwords)
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const revokeSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
    setSuccessMsg("Session revoked successfully!");
    // TODO: API call to revoke session
  };

  return (
    <div>
      <h4 className="mb-4">
        <FaShieldAlt className="me-2 text-danger" /> Security Settings
      </h4>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleSave}>
        {/* Two-Factor Auth */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaLock className="me-2 text-warning" /> Two-Factor Authentication
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="2fa"
              label="Enable Two-Factor Authentication (2FA)"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
            />
            <small className="text-muted">
              Add an extra layer of security to your account.
            </small>
          </Card.Body>
        </Card>

        {/* Suspicious Login Alerts */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaExclamationTriangle className="me-2 text-danger" /> Login Alerts
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="alerts"
              label="Alert me about suspicious login attempts"
              checked={alertLogins}
              onChange={() => setAlertLogins(!alertLogins)}
            />
          </Card.Body>
        </Card>

        {/* Active Sessions */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaSignOutAlt className="me-2 text-primary" /> Active Sessions
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Location</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.device}</td>
                    <td>{s.location}</td>
                    <td>{s.lastActive}</td>
                    <td>
                      {s.current ? (
                        <Badge bg="success">Current</Badge>
                      ) : (
                        <Badge bg="secondary">Active</Badge>
                      )}
                    </td>
                    <td>
                      {!s.current && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => revokeSession(s.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Save Button */}
        <div className="text-end mb-4">
          <Button type="submit" variant="primary">
            <FaSave className="me-2" /> Save Security Settings
          </Button>
        </div>
      </Form>

      {/* Change Password */}
      <Card className="mb-3 shadow-sm">
        <Card.Header className="fw-bold">
          <FaKey className="me-2 text-dark" /> Change Password
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit" variant="success">
              <FaSave className="me-2" /> Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SecuritySettings;
