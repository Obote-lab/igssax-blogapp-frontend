import { useState } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Alert,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import {
  FaCreditCard,
  FaReceipt,
  FaDownload,
  FaExclamationTriangle,
  FaCrown,
  FaCheck,
} from "react-icons/fa";

const themeColor = "#73c2be";

const BillingSettings = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");

  // Mock data - replace with actual API calls
  const subscriptionData = {
    currentPlan: {
      name: "Premium",
      price: "$9.99",
      interval: "month",
      status: "active",
      features: [
        "Unlimited posts",
        "Advanced analytics",
        "Priority support",
        "Custom themes",
      ],
      nextBilling: "Jan 15, 2024",
      renewalDate: "2024-01-15",
    },
    billingHistory: [
      {
        id: 1,
        date: "2023-12-15",
        amount: "$9.99",
        status: "paid",
        invoice: "INV-001",
      },
      {
        id: 2,
        date: "2023-11-15",
        amount: "$9.99",
        status: "paid",
        invoice: "INV-002",
      },
      {
        id: 3,
        date: "2023-10-15",
        amount: "$9.99",
        status: "paid",
        invoice: "INV-003",
      },
    ],
    paymentMethods: [
      { id: 1, type: "visa", last4: "4242", expiry: "12/24", default: true },
      {
        id: 2,
        type: "mastercard",
        last4: "8888",
        expiry: "08/25",
        default: false,
      },
    ],
  };

  const plans = [
    {
      name: "Basic",
      price: "$0",
      interval: "month",
      features: ["Basic features", "Standard support", "1GB storage"],
      current: false,
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      interval: "month",
      features: [
        "All Basic features",
        "Advanced analytics",
        "Priority support",
        "10GB storage",
        "Custom themes",
      ],
      current: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$29.99",
      interval: "month",
      features: [
        "All Premium features",
        "Dedicated support",
        "Unlimited storage",
        "API access",
        "Custom solutions",
      ],
      current: false,
      popular: false,
    },
  ];

  const handleCancelSubscription = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setShowCancelModal(false);
    // Handle successful cancellation
  };

  const handleUpgradePlan = async (plan) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setShowUpgradeModal(false);
    // Handle successful upgrade
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "paid":
        return "success";
      default:
        return "secondary";
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case "visa":
        return "/api/placeholder/40/25";
      case "mastercard":
        return "/api/placeholder/40/25";
      case "amex":
        return "/api/placeholder/40/25";
      default:
        return "/api/placeholder/40/25";
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <FaCreditCard className="me-2" style={{ color: themeColor }} />
        <h4 style={{ color: themeColor, margin: 0 }}>Billing & Subscription</h4>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header
          className="border-0 text-white d-flex justify-content-between align-items-center"
          style={{ backgroundColor: themeColor }}
        >
          <h5 className="mb-0">Current Plan</h5>
          <Badge bg="light" text="dark">
            {subscriptionData.currentPlan.status.toUpperCase()}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <FaCrown className="fs-1 me-3" style={{ color: "#FFD700" }} />
                <div>
                  <h3 className="mb-1">{subscriptionData.currentPlan.name}</h3>
                  <p className="text-muted mb-2">
                    {subscriptionData.currentPlan.price}/
                    {subscriptionData.currentPlan.interval}
                  </p>
                  <p className="mb-0">
                    <strong>Next billing date:</strong>{" "}
                    {subscriptionData.currentPlan.nextBilling}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <h6>Plan Features:</h6>
                <div className="row">
                  {subscriptionData.currentPlan.features.map(
                    (feature, index) => (
                      <div key={index} className="col-md-6 mb-1">
                        <FaCheck className="text-success me-2" size={12} />
                        <small>{feature}</small>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button
                variant="outline-primary"
                className="me-2 mb-2"
                onClick={() => setShowUpgradeModal(true)}
              >
                Change Plan
              </Button>
              <Button
                variant="outline-danger"
                className="mb-2"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Subscription
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Billing History */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="border-0 bg-white">
          <h5 className="mb-0">Billing History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionData.billingHistory.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td className="fw-semibold">{item.amount}</td>
                  <td>
                    <Badge bg={getStatusVariant(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <code>{item.invoice}</code>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      <FaDownload className="me-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Payment Methods */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payment Methods</h5>
          <Button variant="outline-primary" size="sm">
            Add Payment Method
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            {subscriptionData.paymentMethods.map((method) => (
              <Col md={6} key={method.id} className="mb-3">
                <Card className="h-100 border">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <img
                          src={getCardIcon(method.type)}
                          alt={method.type}
                          className="me-3"
                          style={{ width: "40px", height: "25px" }}
                        />
                        <div>
                          <h6 className="mb-1">
                            {method.type.toUpperCase()} •••• {method.last4}
                          </h6>
                          <small className="text-muted">
                            Expires {method.expiry}
                          </small>
                        </div>
                      </div>
                      {method.default && <Badge bg="success">Default</Badge>}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0">
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        Edit
                      </Button>
                      {!method.default && (
                        <Button variant="outline-secondary" size="sm">
                          Set Default
                        </Button>
                      )}
                      {!method.default && (
                        <Button variant="outline-danger" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Cancel Subscription Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-warning me-2" />
            Cancel Subscription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning" className="mb-3">
            <strong>Warning:</strong> Are you sure you want to cancel your
            subscription?
          </Alert>
          <p>
            Your Premium features will be available until{" "}
            <strong>{subscriptionData.currentPlan.nextBilling}</strong>. After
            that, you'll be downgraded to the Basic plan.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Tell us why you're cancelling (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="We'd love to hear your feedback..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
            disabled={loading}
          >
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelSubscription}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              "Yes, Cancel Subscription"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upgrade Plan Modal */}
      <Modal
        show={showUpgradeModal}
        onHide={() => setShowUpgradeModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Your Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {plans.map((plan, index) => (
              <Col md={4} key={index} className="mb-3">
                <Card
                  className={`h-100 border ${
                    plan.popular ? "border-primary" : ""
                  } ${plan.current ? "border-success" : ""}`}
                >
                  {plan.popular && (
                    <div
                      className="text-center py-1 text-white fw-bold"
                      style={{
                        backgroundColor: themeColor,
                        fontSize: "0.8rem",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <Card.Body className="text-center">
                    <h5 className="mb-2">{plan.name}</h5>
                    <h3 className="mb-3" style={{ color: themeColor }}>
                      {plan.price}
                      <small className="text-muted fs-6">
                        /{plan.interval}
                      </small>
                    </h3>
                    <div className="mb-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="mb-1">
                          <small>
                            <FaCheck className="text-success me-1" size={10} />
                            {feature}
                          </small>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 text-center">
                    {plan.current ? (
                      <Button variant="success" disabled className="w-100">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={plan.popular ? "primary" : "outline-primary"}
                        className="w-100"
                        onClick={() => handleUpgradePlan(plan)}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Select Plan"}
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillingSettings;
