// components/livestream/StreamLeftSidebar/StreamLeftSidebar.jsx
import { useState } from "react";
import {
  FaBroadcastTower,
  FaStop,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaVideo,
  FaMusic,
  FaCog,
  FaEye,
  FaHeart,
  FaComment,
  FaUserPlus,
  FaBan,
  FaCrown,
} from "react-icons/fa";
import { useStream } from "../../../context/StreamContext";
import { useAuth } from "../../../context/AuthContext";

function StreamLeftSidebar() {
  const {
    stream,
    streamStatus,
    viewers,
    userRole,
    startStream,
    endStream,
    activePanel,
    setActivePanel,
  } = useStream();

  const { currentUser } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (section) =>
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

  // Mock demo data
  const analyticsData = {
    peakViewers: 125,
    avgWatchTime: "12:34",
    engagementRate: "8.2%",
    newFollowers: 5,
  };

  const moderationData = {
    activeModerators: 2,
    bannedUsers: 3,
    flaggedMessages: 1,
  };

  const isStreamer = userRole === "streamer";
  const isModerator = ["streamer", "moderator"].includes(userRole);

  return (
    <div className="h-100 d-flex flex-column gap-3 p-3 bg-light rounded-4 border overflow-auto">
      {/* STREAM CONTROLS */}
      <SectionCard
        title="Stream Controls"
        icon={<FaBroadcastTower className="text-primary me-2" />}
        collapsed={collapsedSections.controls}
        toggle={() => toggleSection("controls")}
      >
        {/* Stream Status */}
        <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-primary bg-opacity-10 rounded">
          <span className="fw-semibold text-dark">Status</span>
          <span
            className={`badge ${
              streamStatus === "live" ? "bg-danger" : "bg-secondary"
            } rounded-pill`}
          >
            {streamStatus?.toUpperCase()}
          </span>
        </div>

        {/* Stream Actions */}
        {isStreamer && (
          <div className="d-grid gap-2">
            {streamStatus === "offline" ? (
              <button
                className="btn btn-success btn-sm fw-semibold"
                onClick={() => startStream(stream?.id)}
              >
                <FaBroadcastTower className="me-2" />
                Start Stream
              </button>
            ) : (
              <button
                className="btn btn-danger btn-sm fw-semibold"
                onClick={() => endStream(stream?.id)}
              >
                <FaStop className="me-2" />
                End Stream
              </button>
            )}
            <button className="btn btn-outline-primary btn-sm">
              <FaCog className="me-2" />
              Settings
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-3 p-2 bg-white rounded shadow-sm">
          <div className="row text-center g-2">
            <div className="col-6">
              <div className="fw-bold text-dark">{viewers}</div>
              <small className="text-muted">Viewers</small>
            </div>
            <div className="col-6">
              <div className="fw-bold text-dark">245</div>
              <small className="text-muted">Followers</small>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ANALYTICS SECTION */}
      {isStreamer && (
        <SectionCard
          title="Analytics"
          icon={<FaChartLine className="text-primary me-2" />}
          collapsed={collapsedSections.analytics}
          toggle={() => toggleSection("analytics")}
        >
          <div className="row g-2 text-center">
            <StatCard
              color="info"
              icon={<FaEye />}
              value={analyticsData.peakViewers}
              label="Peak"
            />
            <StatCard
              color="success"
              icon={<FaHeart />}
              value={analyticsData.engagementRate}
              label="Engagement"
            />
            <StatCard
              color="warning"
              icon={<FaUserPlus />}
              value={analyticsData.newFollowers}
              label="New Follows"
            />
            <StatCard
              color="primary"
              icon={<FaComment />}
              value={analyticsData.avgWatchTime}
              label="Avg. Watch"
            />
          </div>
          <button
            className="btn btn-outline-primary btn-sm w-100 mt-2"
            onClick={() => setActivePanel("analytics")}
          >
            View Detailed Analytics
          </button>
        </SectionCard>
      )}

      {/* MODERATION SECTION */}
      {isModerator && (
        <SectionCard
          title="Moderation"
          icon={<FaShieldAlt className="text-warning me-2" />}
          collapsed={collapsedSections.moderation}
          toggle={() => toggleSection("moderation")}
        >
          <InfoRow
            label="Moderators"
            value={moderationData.activeModerators}
            color="primary"
          />
          <InfoRow
            label="Banned Users"
            value={moderationData.bannedUsers}
            color="danger"
          />
          <InfoRow
            label="Flagged Messages"
            value={moderationData.flaggedMessages}
            color="warning"
          />
          <div className="d-grid gap-2 mt-2">
            <button className="btn btn-outline-warning btn-sm">
              <FaBan className="me-2" />
              Ban User
            </button>
            <button className="btn btn-outline-success btn-sm">
              <FaCrown className="me-2" />
              Add Moderator
            </button>
          </div>
        </SectionCard>
      )}

      {/* QUICK ACTIONS (VIEWERS) */}
      {!isStreamer && (
        <SectionCard title="Quick Actions">
          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary btn-sm">
              <FaUserPlus className="me-2" /> Follow Streamer
            </button>
            <button className="btn btn-outline-success btn-sm">
              <FaHeart className="me-2" /> Subscribe
            </button>
            <button className="btn btn-outline-info btn-sm">
              <FaComment className="me-2" /> Share Stream
            </button>
          </div>
        </SectionCard>
      )}

      {/* STREAM INFO */}
      <SectionCard title="Stream Info">
        {stream ? (
          <>
            <h6 className="text-dark mb-2">{stream.title}</h6>
            <p className="text-muted small mb-2">{stream.description}</p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary">{stream.category}</span>
              <span className="badge bg-light text-dark border">
                {stream.privacy}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted py-3">
            <div className="spinner-border spinner-border-sm me-2"></div>
            Loading stream info...
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* --- Reusable Bootstrap Section Wrapper --- */
function SectionCard({ title, icon, children, collapsed, toggle }) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-bottom-0 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          {icon} {title}
        </h6>
        {toggle && (
          <button
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={toggle}
          >
            {collapsed ? "▶" : "▼"}
          </button>
        )}
      </div>
      {!collapsed && <div className="card-body">{children}</div>}
    </div>
  );
}

/* --- Small Utility Components --- */
function StatCard({ color, icon, value, label }) {
  return (
    <div className="col-6">
      <div className={`p-2 bg-${color} bg-opacity-10 rounded`}>
        <div className={`text-${color} mb-1`}>{icon}</div>
        <div className="fw-bold text-dark">{value}</div>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span className="text-muted">{label}</span>
      <span className={`badge bg-${color} rounded-pill`}>{value}</span>
    </div>
  );
}

export default StreamLeftSidebar;
