import { Card, Form, Button, Alert } from "react-bootstrap";

const AdvancedSettings = () => {
  return (
    <div>
      <h4 style={{ color: "#73c2be" }}>Advanced Settings</h4>
      <Alert variant="warning" className="mb-3">
        These settings are for advanced users. Please be cautious.
      </Alert>
      <Card className="mb-3">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>API Access</Form.Label>
              <Form.Control type="text" placeholder="API Key" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Enable developer mode" />
            </Form.Group>
            <Button variant="outline-danger">Reset All Settings</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
