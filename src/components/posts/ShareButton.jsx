import { useState, useRef, useEffect } from "react";
import {
  FaShare,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLink,
  FaUserFriends,
  FaFacebookMessenger,
} from "react-icons/fa";
import api from "../../api/axios";

function ShareButton({ postId }) {
  if (!postId) return null; // 🔹 Guard for safety

  const [open, setOpen] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [friends, setFriends] = useState([]);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const postUrl = `${window.location.origin}/posts/${postId}`;

  // 🔹 Fetch friends (replace with your friends API)
  const fetchFriends = async () => {
    try {
      const { data } = await api.get("users/friends/");
      setFriends(data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
      // fallback dummy list
      setFriends([
        { id: 2, username: "Alice" },
        { id: 3, username: "Bob" },
      ]);
    }
  };

  // 🔹 Handle Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard ✅");
    setOpen(false);
  };

  // 🔹 Handle Share Now (simulate instant timeline share)
  const handleShareNow = () => {
    navigator.clipboard.writeText(postUrl);
    alert("Shared to your timeline 🚀");
    setOpen(false);
  };

  // 🔹 Handle Send in Messenger
  const sendInMessenger = async (friendId) => {
    try {
      await api.post("messages/", {
        recipient: friendId,
        content: "Check out this post 🚀",
        post_url: postUrl,
      });
      alert("Sent successfully ✅");
      setShowMessenger(false);
      setOpen(false);
    } catch (err) {
      console.error("Messenger share failed:", err.response?.data || err);
      alert("Failed to send ❌");
    }
  };

  // 🔹 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="position-relative">
      {/* Share Button */}
      <button
        ref={buttonRef}
        className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
        onClick={() => setOpen(!open)}
      >
        <FaShare /> Share
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          ref={menuRef}
          className="position-absolute bg-white shadow rounded p-2"
          style={{ top: "100%", left: "0", zIndex: 1000, minWidth: "240px" }}
        >
          {/* Share Now */}
          <button
            onClick={handleShareNow}
            className="btn btn-link text-dark d-flex align-items-center gap-2 w-100 text-start"
          >
            <FaUserFriends color="#1877f2" /> Share Now
          </button>

          {/* Messenger */}
          <button
            onClick={() => {
              fetchFriends();
              setShowMessenger(true);
            }}
            className="btn btn-link text-dark d-flex align-items-center gap-2 w-100 text-start"
          >
            <FaFacebookMessenger color="#006AFF" /> Send in Messenger
          </button>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              postUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none p-2"
          >
            <FaFacebook color="#1877f2" /> Share to Facebook
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              postUrl
            )}&text=Check this out 🚀`}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none p-2"
          >
            <FaTwitter color="#1DA1F2" /> Share to Twitter
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=Check this out 🚀 ${encodeURIComponent(
              postUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2 text-dark text-decoration-none p-2"
          >
            <FaWhatsapp color="#25D366" /> Share to WhatsApp
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="btn btn-link text-dark d-flex align-items-center gap-2 w-100 text-start"
          >
            <FaLink /> Copy link
          </button>
        </div>
      )}

      {/* Messenger Modal */}
      {showMessenger && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 2000 }}
        >
          <div
            className="bg-white rounded shadow p-4"
            style={{ width: "400px" }}
          >
            <h5 className="mb-3">Send this post in Messenger</h5>

            <ul className="list-group mb-3">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => sendInMessenger(friend.id)}
                >
                  {friend.username}
                </li>
              ))}
            </ul>

            <button
              className="btn btn-secondary w-100"
              onClick={() => setShowMessenger(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
