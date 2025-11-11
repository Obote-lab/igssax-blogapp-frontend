// components/livestream/CreateStream.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { livestreamAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function CreateStream() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    privacy: "public",
    scheduled_for: "",
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    let payload = { ...formData };

    // ✅ Remove empty scheduled_for
    if (!payload.scheduled_for) {
      delete payload.scheduled_for;
    } else {
      const localDate = new Date(payload.scheduled_for);
      if (!isNaN(localDate.getTime())) {
        payload.scheduled_for = localDate.toISOString();
      } else {
        delete payload.scheduled_for;
      }
    }

    console.log("Payload being sent:", payload);
    const response = await livestreamAPI.createStream(payload);
    const stream = response.data;
    navigate(`/live/${stream.id}`);
  } catch (error) {
    console.error("Failed to create stream:", error.response?.data || error);
    alert("Failed to create stream. Please try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold">Create New Stream</h3>

              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Stream Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title for your stream"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what your stream is about..."
                  />
                </div>

                {/* Category & Privacy */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="category"
                      className="form-label fw-semibold"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      <option value="gaming">Gaming</option>
                      <option value="music">Music</option>
                      <option value="education">Education</option>
                      <option value="talk">Just Chatting</option>
                      <option value="creative">Creative</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="privacy" className="form-label fw-semibold">
                      Privacy
                    </label>
                    <select
                      id="privacy"
                      name="privacy"
                      className="form-select"
                      value={formData.privacy}
                      onChange={handleChange}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Scheduled For (optional) */}
                <div className="mb-3">
                  <label
                    htmlFor="scheduled_for"
                    className="form-label fw-semibold"
                  >
                    Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduled_for"
                    name="scheduled_for"
                    className="form-control"
                    value={formData.scheduled_for}
                    onChange={handleChange}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/live")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !formData.title}
                  >
                    {loading ? "Creating..." : "Create Stream"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-4 p-3 bg-light border-start border-primary rounded">
            <h5 className="fw-semibold mb-2">💡 Stream Tips</h5>
            <ul className="mb-0 ps-3 small text-muted">
              <li>Choose an engaging title to attract viewers</li>
              <li>Use relevant categories to help viewers find your stream</li>
              <li>Test your audio and video before going live</li>
              <li>Engage actively with your chat for better connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStream;
