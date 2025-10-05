import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../ThemeContext";
import ActivityFeed from "../rightbar/ActivityFeed";
import TrendingTopics from "../rightbar/TrendingTopics";
import UpcomingEvents from "../rightbar/UpcomingEvents";
import QuickStats from "../rightbar/QuickStats";
import SuggestedConnections from "../rightbar/SuggestedConnections";
import WeatherWidget from "../rightbar/WeatherWidget";
import LiveStreams from "../rightbar/LiveStreams";
import BirthdayReminders from "../rightbar/BirthdayReminders";
import QuickSettings from "../rightbar/QuickSettings";
import "./RightSidebar.css";

function RightSidebar() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("activity");
  const [liveStreams, setLiveStreams] = useState([]);
  const [birthdays, setBirthdays] = useState([]);

  // Get theme color dynamically
  const getThemeColor = () => {
    const root = document.documentElement;
    return (
      getComputedStyle(root).getPropertyValue("--accent-color").trim() ||
      "#73c2be"
    );
  };

  const themeColor = getThemeColor();

  // Mock data for live streams
  useEffect(() => {
    setLiveStreams([
      {
        id: 1,
        user: "Tech Talks",
        viewers: 1240,
        title: "AI Revolution",
        category: "Technology",
      },
      {
        id: 2,
        user: "Music Live",
        viewers: 856,
        title: "Acoustic Session",
        category: "Music",
      },
      {
        id: 3,
        user: "Gaming Pro",
        viewers: 2100,
        title: "New Game Launch",
        category: "Gaming",
      },
    ]);
  }, []);

  // Mock data for birthdays
  useEffect(() => {
    setBirthdays([
      {
        id: 1,
        name: "Sarah Johnson",
        daysLeft: 0,
        avatar: "https://via.placeholder.com/40",
      },
      {
        id: 2,
        name: "Mike Chen",
        daysLeft: 2,
        avatar: "https://via.placeholder.com/40",
      },
      {
        id: 3,
        name: "Emma Wilson",
        daysLeft: 5,
        avatar: "https://via.placeholder.com/40",
      },
    ]);
  }, []);

  const sidebarTabs = [
    { id: "activity", label: "Activity", icon: "🔔", badge: "3" },
    { id: "trending", label: "Trending", icon: "🔥", badge: "12" },
    { id: "events", label: "Events", icon: "📅", badge: "5" },
    { id: "connections", label: "People", icon: "👥", badge: "8" },
    { id: "streams", label: "Live", icon: "🔴", badge: "3" },
  ];

  const quickStats = {
    posts: { value: 247, change: "+12%", trend: "up" },
    followers: { value: "12.4K", change: "+5%", trend: "up" },
    engagement: { value: "8.2%", change: "+2.1%", trend: "up" },
    reach: { value: "45.7K", change: "-3%", trend: "down" },
  };

  return (
    <div className="right-sidebar">
      {/* Header with User Quick Info */}
      <div className="sidebar-header">
        <div className="user-quick-info">
          <img
            src={
              currentUser?.profile?.avatar || "https://via.placeholder.com/40"
            }
            alt={currentUser?.first_name}
            className="user-avatar"
          />
          <div className="user-details">
            <h6 className="user-name mb-0">
              {currentUser?.first_name} {currentUser?.last_name}
            </h6>
            <div className="user-status-container">
              <span className="user-status">Active now</span>
              <div className="status-indicator online"></div>
            </div>
          </div>
          <QuickSettings themeColor={themeColor} />
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Quick Stats */}
      <QuickStats stats={quickStats} />

      {/* Tab Navigation */}
      <div className="sidebar-tabs">
        {sidebarTabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor:
                activeTab === tab.id ? themeColor : "var(--bg-secondary)",
              borderColor:
                activeTab === tab.id ? themeColor : "var(--border-color)",
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "activity" && <ActivityFeed />}
        {activeTab === "trending" && <TrendingTopics />}
        {activeTab === "events" && <UpcomingEvents />}
        {activeTab === "connections" && <SuggestedConnections />}
        {activeTab === "streams" && <LiveStreams streams={liveStreams} />}
      </div>

      {/* Birthday Reminders */}
      <BirthdayReminders birthdays={birthdays} themeColor={themeColor} />

      {/* Always Visible Widgets */}
      <div className="sidebar-widgets">
        <div className="premium-promo">
          <div className="premium-icon">✨</div>
          <div className="premium-content">
            <h6>Go Premium</h6>
            <p>Unlock exclusive features</p>
            <button
              className="btn-premium"
              style={{ backgroundColor: themeColor }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
