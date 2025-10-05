import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import { FaSave, FaUser, FaLock } from "react-icons/fa";
import { usersAPI } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

const themeColor = "#73c2be";

function AccountSettings() {
  const { updateUser, user } = useAuth();

  const [formData, setFormData] = useState({
    // User fields
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",

    // Profile fields
    bio: "",
    location: "",
    birth_date: "",
    gender: "",
    website: "",
    work: "",
    education: "",
    relationship_status: "",
    interests: "",
    hobbies: "",

    // Files
    avatar: null,
    cover_photo: null,

    // Password fields
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  // Load user details
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await usersAPI.getMe();

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          bio: data.profile?.bio || "",
          location: data.profile?.location || "",
          birth_date: data.profile?.birth_date || "",
          gender: data.profile?.gender || "",
          website: data.profile?.website || "",
          work: data.profile?.work || "",
          education: data.profile?.education || "",
          relationship_status: data.profile?.relationship_status || "",
          interests: data.profile?.interests || "",
          hobbies: data.profile?.hobbies || "",
          avatar: null,
          cover_photo: null,
          current_password: "",
          new_password: "",
          confirm_password: "",
        });

        // Set preview images
        if (data.profile?.avatar) {
          setAvatarPreview(data.profile.avatar);
        }
        if (data.profile?.cover_photo) {
          setCoverPreview(data.profile.cover_photo);
        }
      } catch (err) {
        console.error("Load user error:", err);
        setErrorMsg("Could not load account details.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview for images
      if (name === "avatar") {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (name === "cover_photo") {
        setCoverPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Password validation
    if (
      formData.new_password &&
      formData.new_password !== formData.confirm_password
    ) {
      setErrorMsg("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    // If changing password, current password is required
    if (formData.new_password && !formData.current_password) {
      setErrorMsg("Current password is required to change password.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();

      // Append all fields except empty passwords and null files
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty password fields unless we're actually changing password
        if (key.includes("password")) {
          if (value) {
            payload.append(key, value);
          }
        }
        // Handle file fields
        else if (key === "avatar" || key === "cover_photo") {
          if (value instanceof File) {
            payload.append(key, value);
          }
        }
        // Handle other fields
        else if (value !== null && value !== undefined && value !== "") {
          payload.append(key, value);
        }
      });

      // Use the correct API endpoint for account update
      const { data } = await usersAPI.updateProfile(payload);

      // Update auth context
      updateUser(data);

      setSuccessMsg("Account settings updated successfully!");

      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);

      // Handle backend validation errors
      if (err.response?.data) {
        const errorData = err.response.data;

        // Handle field-specific errors
        if (typeof errorData === "object") {
          const errorMessages = Object.values(errorData).flat();
          setErrorMsg(errorMessages.join(", "));
        } else if (typeof errorData === "string") {
          setErrorMsg(errorData);
        } else {
          setErrorMsg(
            "Failed to update account settings. Please check your inputs."
          );
        }
      } else {
        setErrorMsg("Failed to update account settings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" style={{ color: themeColor }} />
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <FaUser className="me-2" style={{ color: themeColor }} />
        <h4 style={{ color: themeColor, margin: 0 }}>Account Settings</h4>
      </div>

      {successMsg && (
        <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Profile Images Section */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: themeColor, color: "white" }}>
            <h6 className="mb-0">Profile Images</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={avatarPreview || "https://via.placeholder.com/100"}
                      alt="Avatar"
                      className="rounded-circle border"
                      width="100"
                      height="100"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <Form.Control
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted">
                        Recommended: 200x200px, JPG or PNG
                      </Form.Text>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Photo</Form.Label>
                  {coverPreview && (
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="img-fluid rounded mb-2"
                      style={{
                        maxHeight: "100px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  )}
                  <Form.Control
                    type="file"
                    name="cover_photo"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Recommended: 1200x300px, JPG or PNG
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Personal Information */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: themeColor, color: "white" }}>
            <h6 className="mb-0">Personal Information</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Profile Details */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: themeColor, color: "white" }}>
            <h6 className="mb-0">Profile Details</h6>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Social Information */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: themeColor, color: "white" }}>
            <h6 className="mb-0">Social Information</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Work</Form.Label>
                  <Form.Control
                    type="text"
                    name="work"
                    value={formData.work}
                    onChange={handleChange}
                    placeholder="Your profession"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Education</Form.Label>
                  <Form.Control
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Your education"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Relationship Status</Form.Label>
              <Form.Select
                name="relationship_status"
                value={formData.relationship_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="in_relationship">In a relationship</option>
                <option value="married">Married</option>
                <option value="complicated">It's complicated</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interests</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Your interests..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hobbies</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="Your hobbies..."
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Password Change */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: themeColor, color: "white" }}>
            <div className="d-flex align-items-center">
              <FaLock className="me-2" />
              <h6 className="mb-0">Change Password</h6>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Text className="text-muted">
              Leave password fields empty if you don't want to change your
              password.
            </Form.Text>
          </Card.Body>
        </Card>

        {/* Submit Button */}
        <div className="text-end">
          <Button
            type="submit"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving Changes...
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
