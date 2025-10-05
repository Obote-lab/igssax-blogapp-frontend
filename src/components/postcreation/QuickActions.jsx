import { FaImage, FaUserTag, FaSmile, FaMapMarkerAlt } from "react-icons/fa";

const quickActions = [
  {
    icon: FaImage,
    label: "Photo/Video",
    color: "#45bd62",
  },
  {
    icon: FaUserTag,
    label: "Tag Friends",
    color: "#1877f2",
  },
  {
    icon: FaSmile,
    label: "Feeling/Activity",
    color: "#f7b928",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Check In",
    color: "#f5533d",
  },
];

function QuickActions({ onShowOptions, onImageUpload, loading }) {
  const handleActionClick = (action) => {
    if (action.label === "Photo/Video") {
      onImageUpload();
    } else if (action.label === "Tag Friends") {
      onShowOptions();
    }
    // Add other action handlers as needed
  };

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <h6 className="mb-3 text-muted fw-semibold">Add to your post</h6>
      <div className="row g-2">
        {quickActions.map((action, index) => (
          <div key={index} className="col-6 col-sm-3">
            <button
              type="button"
              className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 post-option"
              onClick={() => handleActionClick(action)}
              disabled={loading}
            >
              <action.icon style={{ color: action.color }} />
              <span className="small">{action.label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
