import { Card, Form, Row, Col } from "react-bootstrap";
import { FaUniversalAccess, FaLanguage } from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";

const themeColor = "#73c2be";

function AccessibilitySettings() {
  const {
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    colorBlindMode,
    setColorBlindMode,
    language,
    setLanguage,
  } = useTheme();

  return (
    <div>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="border-0 bg-white">
          <h5 className="mb-0">
            <FaUniversalAccess className="me-2" style={{ color: themeColor }} />
            Accessibility Features
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="reducedMotion"
                label={
                  <div>
                    <div className="fw-semibold">Reduced Motion</div>
                    <small className="text-muted">
                      Reduce animations and transitions for better comfort
                    </small>
                  </div>
                }
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="mb-4 p-3 border rounded"
              />

              <Form.Check
                type="switch"
                id="highContrast"
                label={
                  <div>
                    <div className="fw-semibold">High Contrast Mode</div>
                    <small className="text-muted">
                      Increase color contrast for better visibility
                    </small>
                  </div>
                }
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="mb-4 p-3 border rounded"
              />
            </Col>

            <Col md={6}>
              <Form.Check
                type="switch"
                id="colorBlindMode"
                label={
                  <div>
                    <div className="fw-semibold">Color Blind Friendly</div>
                    <small className="text-muted">
                      Optimize colors for color vision deficiency
                    </small>
                  </div>
                }
                checked={colorBlindMode}
                onChange={(e) => setColorBlindMode(e.target.checked)}
                className="mb-4 p-3 border rounded"
              />

              <Form.Group>
                <Form.Label className="fw-semibold">
                  <FaLanguage className="me-2" />
                  Language
                </Form.Label>
                <Form.Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Choose your preferred language
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AccessibilitySettings;
