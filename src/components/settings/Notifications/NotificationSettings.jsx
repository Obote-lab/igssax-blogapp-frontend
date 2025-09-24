import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import {
  FaBell,
  FaEnvelope,
  FaMobileAlt,
  FaCommentDots,
  FaDesktop,
  FaSave,
} from "react-icons/fa";

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: {
      postUpdates: true,
      friendRequests: true,
      securityAlerts: true,
    },
    push: {
      messages: true,
      mentions: true,
      activity: false,
    },
    sms: {
      loginAlerts: false,
      accountActivity: false,
    },
    inApp: {
      likes: true,
      comments: true,
      follows: true,
    },
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleToggle = (category, name) => (e) => {
    setSettings({
      ...settings,
      [category]: { ...settings[category], [name]: e.target.checked },
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg("Notification settings saved successfully!");
    // TODO: Replace with real API call
    // axios.patch("/api/settings/notifications", settings)
  };

  return (
    <div>
      <h4 className="mb-4">
        <FaBell className="me-2 text-primary" /> Notification Settings
      </h4>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleSave}>
        {/* Email Notifications */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaEnvelope className="me-2 text-danger" /> Email Notifications
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="emailPostUpdates"
              label="Post updates"
              checked={settings.email.postUpdates}
              onChange={handleToggle("email", "postUpdates")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="emailFriendRequests"
              label="Friend requests"
              checked={settings.email.friendRequests}
              onChange={handleToggle("email", "friendRequests")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="emailSecurityAlerts"
              label="Security alerts"
              checked={settings.email.securityAlerts}
              onChange={handleToggle("email", "securityAlerts")}
            />
          </Card.Body>
        </Card>

        {/* Push Notifications */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaMobileAlt className="me-2 text-success" /> Push Notifications
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="pushMessages"
              label="Direct messages"
              checked={settings.push.messages}
              onChange={handleToggle("push", "messages")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="pushMentions"
              label="Mentions"
              checked={settings.push.mentions}
              onChange={handleToggle("push", "mentions")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="pushActivity"
              label="Activity updates"
              checked={settings.push.activity}
              onChange={handleToggle("push", "activity")}
            />
          </Card.Body>
        </Card>

        {/* SMS Notifications */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaCommentDots className="me-2 text-warning" /> SMS Notifications
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="smsLoginAlerts"
              label="Login alerts"
              checked={settings.sms.loginAlerts}
              onChange={handleToggle("sms", "loginAlerts")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="smsAccountActivity"
              label="Account activity"
              checked={settings.sms.accountActivity}
              onChange={handleToggle("sms", "accountActivity")}
            />
          </Card.Body>
        </Card>

        {/* In-App Notifications */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaDesktop className="me-2 text-info" /> In-App Notifications
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="inAppLikes"
              label="Likes"
              checked={settings.inApp.likes}
              onChange={handleToggle("inApp", "likes")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="inAppComments"
              label="Comments"
              checked={settings.inApp.comments}
              onChange={handleToggle("inApp", "comments")}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="inAppFollows"
              label="Follows"
              checked={settings.inApp.follows}
              onChange={handleToggle("inApp", "follows")}
            />
          </Card.Body>
        </Card>

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

export default NotificationSettings;
