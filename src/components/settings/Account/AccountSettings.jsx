import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaUpload, FaLock } from "react-icons/fa";

function AccountSettings() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Simulate API call
    setTimeout(() => {
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        setErrorMsg("New password and confirm password do not match.");
      } else {
        setSuccessMsg("Account settings updated successfully!");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <h4 className="mb-4">Account Settings</h4>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Avatar Upload */}
        <Form.Group controlId="formAvatar" className="mb-4">
          <Form.Label>Profile Picture</Form.Label>
          <div className="d-flex align-items-center gap-3">
            <img
              src={
                formData.avatar
                  ? URL.createObjectURL(formData.avatar)
                  : "https://via.placeholder.com/80"
              }
              alt="Avatar Preview"
              className="rounded-circle border"
              width="80"
              height="80"
              style={{ objectFit: "cover" }}
            />
            <Form.Control
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {/* Name */}
        <div className="row">
          <Form.Group className="col-md-6 mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </Form.Group>
        </div>

        {/* Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </Form.Group>

        {/* Password Section */}
        <h6 className="mt-4 mb-3">
          <FaLock className="me-2" /> Change Password
        </h6>

        <Form.Group className="mb-3" controlId="formCurrentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
        </Form.Group>

        <div className="row">
          <Form.Group className="col-md-6 mb-3" controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </Form.Group>
        </div>

        {/* Save Button */}
        <div className="text-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AccountSettings;
