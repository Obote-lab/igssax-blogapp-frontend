import { useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import {
  FaSun,
  FaMoon,
  FaDesktop,
  FaFont,
  FaCompressArrowsAlt,
  FaSave,
} from "react-icons/fa";

function DisplaySettings() {
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState(16);
  const [density, setDensity] = useState("comfortable");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg("Display settings updated successfully!");
    // TODO: Replace with real API call
    // axios.patch("/api/settings/display", { theme, fontSize, density })
  };

  return (
    <div>
      <h4 className="mb-4">
        <FaDesktop className="me-2 text-primary" /> Display Settings
      </h4>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleSave}>
        {/* Theme */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaSun className="me-2 text-warning" /> Theme
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="radio"
              name="theme"
              id="light"
              label={
                <>
                  <FaSun className="me-2 text-warning" /> Light
                </>
              }
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              name="theme"
              id="dark"
              label={
                <>
                  <FaMoon className="me-2 text-dark" /> Dark
                </>
              }
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              name="theme"
              id="system"
              label={
                <>
                  <FaDesktop className="me-2 text-primary" /> System Default
                </>
              }
              checked={theme === "system"}
              onChange={() => setTheme("system")}
            />
          </Card.Body>
        </Card>

        {/* Font Size */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaFont className="me-2 text-success" /> Font Size
          </Card.Header>
          <Card.Body>
            <Form.Label>
              Adjust font size: <strong>{fontSize}px</strong>
            </Form.Label>
            <Form.Range
              min={12}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </Card.Body>
        </Card>

        {/* Layout Density */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">
            <FaCompressArrowsAlt className="me-2 text-info" /> Layout Density
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="radio"
              name="density"
              id="comfortable"
              label="Comfortable"
              checked={density === "comfortable"}
              onChange={() => setDensity("comfortable")}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              name="density"
              id="compact"
              label="Compact"
              checked={density === "compact"}
              onChange={() => setDensity("compact")}
            />
          </Card.Body>
        </Card>

        {/* Live Preview */}
        <Card className="mb-3 shadow-sm">
          <Card.Header className="fw-bold">Live Preview</Card.Header>
          <Card.Body
            style={{
              backgroundColor:
                theme === "dark"
                  ? "#1e1e1e"
                  : theme === "light"
                  ? "#ffffff"
                  : "#f8f9fa",
              color: theme === "dark" ? "#f8f9fa" : "#212529",
              fontSize: `${fontSize}px`,
              padding: density === "compact" ? "8px" : "16px",
              borderRadius: "8px",
            }}
          >
            <p>
              This is a preview of your <strong>display settings</strong>.
              Adjust theme, font size, and layout density to customize your
              experience.
            </p>
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

export default DisplaySettings;
