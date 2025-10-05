import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import {
  FaBan,
  FaTrash,
  FaSearch,
  FaUserSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { privacyAPI, usersAPI } from "../../../api/axios";

const themeColor = "#73c2be";

function BlockUsers() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    setLoading(true);
    try {
      const { data } = await privacyAPI.getBlockedUsers();
      setBlockedUsers(data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load blocked users" });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await usersAPI.searchUsers(query);
      setSearchResults(data.results || data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await privacyAPI.blockUser(user.id, blockReason);
      setMessage({
        type: "success",
        text: `Successfully blocked ${user.first_name} ${user.last_name}`,
      });
      setShowBlockModal(false);
      setBlockReason("");
      setSelectedUser(null);
      loadBlockedUsers();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to block user" });
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      await privacyAPI.unblockUser(user.blocked_user_id || user.id);
      setMessage({ type: "success", text: `Successfully unblocked user` });
      setShowUnblockModal(false);
      setSelectedUser(null);
      loadBlockedUsers();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to unblock user" });
    }
  };

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const openUnblockModal = (user) => {
    setSelectedUser(user);
    setShowUnblockModal(true);
  };

  const filteredBlockedUsers = blockedUsers.filter(
    (user) =>
      user.blocked_user_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.blocked_user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header
          className="border-0 text-white d-flex align-items-center"
          style={{ backgroundColor: themeColor }}
        >
          <FaUserSlash className="me-2" />
          <h5 className="mb-0">Block Users</h5>
        </Card.Header>

        <Card.Body>
          {message.text && (
            <Alert variant={message.type === "success" ? "success" : "danger"}>
              {message.text}
            </Alert>
          )}

          <div className="mb-4">
            <h6>Block New User</h6>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search users to block..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchUsers(e.target.value);
                }}
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>

            {searching && (
              <div className="text-center mt-2">
                <Spinner animation="border" size="sm" />
              </div>
            )}

            {searchResults.length > 0 && (
              <Card className="mt-2">
                <Card.Body className="p-2">
                  {searchResults.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="d-flex justify-content-between align-items-center p-2 border-bottom"
                    >
                      <div>
                        <strong>
                          {user.first_name} {user.last_name}
                        </strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openBlockModal(user)}
                      >
                        <FaBan className="me-1" />
                        Block
                      </Button>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0 bg-light">
          <h5 className="mb-0">Blocked Users ({blockedUsers.length})</h5>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: themeColor }} />
            </div>
          ) : filteredBlockedUsers.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <FaBan size={48} className="mb-3" />
              <p>No users blocked</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Blocked Since</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlockedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <strong>{user.blocked_user_name}</strong>
                        <br />
                        <small className="text-muted">
                          {user.blocked_user_email}
                        </small>
                      </div>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {user.reason ? (
                        <Badge bg="secondary">{user.reason}</Badge>
                      ) : (
                        <span className="text-muted">No reason provided</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => openUnblockModal(user)}
                      >
                        <FaTrash className="me-1" />
                        Unblock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Block User Modal */}
      <Modal
        show={showBlockModal}
        onHide={() => setShowBlockModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-warning me-2" />
            Block User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                Are you sure you want to block{" "}
                <strong>
                  {selectedUser.first_name} {selectedUser.last_name}
                </strong>
                ?
              </p>
              <p className="text-muted">This user will no longer be able to:</p>
              <ul className="text-muted">
                <li>Send you messages</li>
                <li>See your posts or stories</li>
                <li>Send friend requests</li>
                <li>Follow you or see your activity</li>
              </ul>
              <Form.Group>
                <Form.Label>Reason (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Why are you blocking this user?"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleBlockUser(selectedUser)}
          >
            <FaBan className="me-1" />
            Block User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Unblock User Modal */}
      <Modal
        show={showUnblockModal}
        onHide={() => setShowUnblockModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Unblock User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              Are you sure you want to unblock{" "}
              <strong>{selectedUser.blocked_user_name}</strong>? They will be
              able to interact with you again.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnblockModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => handleUnblockUser(selectedUser)}
          >
            <FaTrash className="me-1" />
            Unblock User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BlockUsers;
