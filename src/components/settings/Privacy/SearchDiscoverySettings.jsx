import { useState, useEffect } from "react";
import { Card, Form, Alert, Badge, Spinner } from "react-bootstrap";
import { FaSearch, FaGoogle, FaUserSecret, FaSave } from "react-icons/fa";
import { privacyAPI } from "../../../api/axios";

const themeColor = "#73c2be";

function SearchDiscoverySettings() {
  const [settings, setSettings] = useState({
    search_engine_indexing: true,
    show_in_search_results: true,
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
        search_engine_indexing: data.search_engine_indexing,
        show_in_search_results: data.show_in_search_results,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load discovery settings" });
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
      setMessage({ type: "success", text: "Discovery settings updated!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update settings" });
      setSettings((prev) => ({ ...prev, [field]: !value }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: themeColor }} />
        <p className="mt-2">Loading discovery settings...</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header
        className="border-0 text-white d-flex align-items-center"
        style={{ backgroundColor: themeColor }}
      >
        <FaSearch className="me-2" />
        <h5 className="mb-0">Search & Discovery</h5>
      </Card.Header>

      <Card.Body>
        {message.text && (
          <Alert variant={message.type === "success" ? "success" : "danger"}>
            {message.text}
          </Alert>
        )}

        <div className="mb-4 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-1">
                <FaGoogle className="me-2 text-success" />
                Search Engine Indexing
              </h6>
              <small className="text-muted">
                Allow search engines like Google to index your profile
              </small>
            </div>
            <Form.Check
              type="switch"
              checked={settings.search_engine_indexing}
              onChange={(e) =>
                handleToggle("search_engine_indexing", e.target.checked)
              }
              disabled={saving}
            />
          </div>
          <Badge
            bg={settings.search_engine_indexing ? "success" : "secondary"}
            className="ms-4"
          >
            {settings.search_engine_indexing ? "Indexed" : "Not Indexed"}
          </Badge>
          {!settings.search_engine_indexing && (
            <div className="mt-2 ms-4">
              <small className="text-warning">
                Your profile won't appear in search engine results
              </small>
            </div>
          )}
        </div>

        <div className="mb-4 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-1">
                <FaUserSecret className="me-2 text-primary" />
                Show in Search Results
              </h6>
              <small className="text-muted">
                Allow other users to find you in platform search
              </small>
            </div>
            <Form.Check
              type="switch"
              checked={settings.show_in_search_results}
              onChange={(e) =>
                handleToggle("show_in_search_results", e.target.checked)
              }
              disabled={saving}
            />
          </div>
          <Badge
            bg={settings.show_in_search_results ? "success" : "secondary"}
            className="ms-4"
          >
            {settings.show_in_search_results ? "Discoverable" : "Hidden"}
          </Badge>
          {!settings.show_in_search_results && (
            <div className="mt-2 ms-4">
              <small className="text-warning">
                Other users won't be able to find you through search
              </small>
            </div>
          )}
        </div>

        {saving && (
          <div className="text-center">
            <Spinner animation="border" size="sm" className="me-2" />
            <small>Saving changes...</small>
          </div>
        )}

        {/* Information Section */}
        <Card className="mt-4 border-0 bg-light">
          <Card.Body>
            <h6>
              <FaSearch className="me-2" />
              About Search & Discovery
            </h6>
            <small className="text-muted">
              These settings control how others can find and discover your
              profile. Turning these off increases your privacy but makes it
              harder for friends and connections to find you on the platform.
            </small>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
}

export default SearchDiscoverySettings;
