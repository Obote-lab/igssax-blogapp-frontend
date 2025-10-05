import { useState } from "react";
import { Card, Tab, Nav, Alert } from "react-bootstrap";
import {
  FaShieldAlt,
  FaEye,
  FaUserSlash,
  FaGlobe,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";
import ActivityStatusToggle from "./ActivityStatusToggle";
import BlockUsers from "./BlockedUsers";
import PostVisibilitySettings from "./PostVisibilitySettings";
import SearchDiscoverySettings from "./SearchDiscoverySettings";

const themeColor = "#73c2be";

function PrivacySettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });

  const tabs = [
    {
      key: "profile",
      title: "Profile & Posts",
      icon: <FaGlobe />,
      component: <PostVisibilitySettings />,
    },
    {
      key: "activity",
      title: "Activity Status",
      icon: <FaEye />,
      component: <ActivityStatusToggle />,
    },
    {
      key: "blocking",
      title: "Blocked Users",
      icon: <FaUserSlash />,
      component: <BlockUsers />,
    },
    {
      key: "discovery",
      title: "Search & Discovery",
      icon: <FaSearch />,
      component: <SearchDiscoverySettings />,
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <FaShieldAlt className="me-2" style={{ color: themeColor }} />
        <h4 style={{ color: themeColor, margin: 0 }}>Privacy & Security</h4>
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

export default PrivacySettings;
