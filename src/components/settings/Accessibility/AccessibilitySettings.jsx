import { Card, Form } from "react-bootstrap";

const AccessibilitySettings = () => {
  return (
    <div>
      <h4 style={{ color: "#73c2be" }}>Accessibility</h4>
      <Card className="mb-3">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Font Size</Form.Label>
              <Form.Select>
                <option>Small</option>
                <option selected>Medium</option>
                <option>Large</option>
                <option>Extra Large</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="High contrast mode" />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;
