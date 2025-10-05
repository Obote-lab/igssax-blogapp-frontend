import { Card, Form, Row, Col, Badge } from "react-bootstrap";
import { FaFont, FaCompressArrowsAlt } from "react-icons/fa";
import { useTheme } from "../../../ThemeContext";

const themeColor = "#73c2be";

function TypographySettings() {
  const { fontSize, setFontSize, layoutDensity, setLayoutDensity } = useTheme();

  const fontSizes = [
    { value: 12, label: "Small" },
    { value: 14, label: "Medium" },
    { value: 16, label: "Large" },
    { value: 18, label: "X-Large" },
    { value: 20, label: "XX-Large" },
  ];

  return (
    <div>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="border-0 bg-white">
          <h5 className="mb-0">
            <FaFont className="me-2" style={{ color: themeColor }} />
            Typography
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Font Size</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Range
                    min={12}
                    max={20}
                    step={1}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                  <Badge bg="light" text="dark" style={{ minWidth: "60px" }}>
                    {fontSize}px
                  </Badge>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">Small</small>
                  <small className="text-muted">Large</small>
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div
                className="border rounded p-3 text-center"
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="fw-bold">Sample Text</div>
                <small className="text-muted">
                  This is how your text will appear
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-white">
          <h5 className="mb-0">
            <FaCompressArrowsAlt
              className="me-2"
              style={{ color: themeColor }}
            />
            Layout & Spacing
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label className="fw-semibold">Layout Density</Form.Label>
            <div>
              {["comfortable", "compact"].map((density) => (
                <Form.Check
                  key={density}
                  type="radio"
                  name="density"
                  id={density}
                  label={
                    <div>
                      <div className="fw-semibold text-capitalize">
                        {density}
                      </div>
                      <small className="text-muted">
                        {density === "comfortable"
                          ? "More spacing between elements for easier reading"
                          : "Tighter spacing to show more content at once"}
                      </small>
                    </div>
                  }
                  checked={layoutDensity === density}
                  onChange={() => setLayoutDensity(density)}
                  className="mb-3 p-3 border rounded"
                />
              ))}
            </div>
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TypographySettings;
