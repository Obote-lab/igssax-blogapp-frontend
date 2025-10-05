import { Card, Form, Button } from "react-bootstrap";

const SocialSettings = () => {
  return (
    <div>
      <h4 style={{ color: "#73c2be" }}>Social Settings</h4>
      <Card className="mb-3">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Social Media Connections</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Button variant="outline-primary" size="sm">
                  Connect Facebook
                </Button>
                <Button variant="outline-info" size="sm">
                  Connect Twitter
                </Button>
                <Button variant="outline-danger" size="sm">
                  Connect Instagram
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow social sharing"
                defaultChecked
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SocialSettings;
