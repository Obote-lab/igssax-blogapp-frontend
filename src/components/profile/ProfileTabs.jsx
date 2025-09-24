import { useState } from "react";
import TimelineTab from "./tabs/TimeLineTab";
import AboutTab from "./tabs/AboutTab";
import FriendsTab from "./tabs/FriendsTab";
import PhotosTab from "./tabs/PhotosTab";
import {
  FaRegNewspaper,
  FaUserFriends,
  FaInfoCircle,
  FaImages,
} from "react-icons/fa";

function ProfileTabs({ user, posts }) {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { key: "timeline", label: "Posts", icon: <FaRegNewspaper /> },
    { key: "about", label: "About", icon: <FaInfoCircle /> },
    { key: "friends", label: "Friends", icon: <FaUserFriends /> },
    { key: "photos", label: "Photos", icon: <FaImages /> },
  ];

  return (
    <div className="card shadow-sm rounded-4">
      {/* Tabs Header */}
      <ul className="nav nav-tabs px-3 pt-3">
        {tabs.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${
                activeTab === tab.key ? "active fw-bold" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tabs Content */}
      <div className="p-3">
        {activeTab === "timeline" && <TimelineTab posts={posts} />}
        {activeTab === "about" && <AboutTab user={user} />}
        {activeTab === "friends" && <FriendsTab userId={user.id} />}
        {activeTab === "photos" && <PhotosTab userId={user.id} />}
      </div>
    </div>
  );
}

export default ProfileTabs;
