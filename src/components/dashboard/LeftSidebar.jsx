import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../ThemeContext";
import UserProfile from "../leftbar/UserProfile";
import MenuSection from "../leftbar/MenuSection";
import QuickActions from "../leftbar/QuickActions";
import SearchBar from "../leftbar/SearchBar";
import RecentActivity from "../leftbar/RecentActivity";
import OnlineFriends from "../leftbar/OnlineFriends";
import "./LeftSidebar.css";

function LeftSidebar() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Get theme color dynamically
  const getThemeColor = () => {
    const root = document.documentElement;
    return (
      getComputedStyle(root).getPropertyValue("--accent-color").trim() ||
      "#73c2be"
    );
  };

  const themeColor = getThemeColor();

  // Mock data for online friends
  useEffect(() => {
    setOnlineFriends([
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://via.placeholder.com/40",
        status: "online",
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "https://via.placeholder.com/40",
        status: "online",
      },
      {
        id: 3,
        name: "Emma Wilson",
        avatar: "https://via.placeholder.com/40",
        status: "online",
      },
      {
        id: 4,
        name: "Alex Rivera",
        avatar: "https://via.placeholder.com/40",
        status: "away",
      },
    ]);
  }, []);

  // Mock data for recent activity
  useEffect(() => {
    setRecentActivity([
      {
        id: 1,
        type: "post",
        user: "Sarah Johnson",
        action: "shared a post",
        time: "5 min ago",
      },
      {
        id: 2,
        type: "like",
        user: "Mike Chen",
        action: "liked your photo",
        time: "12 min ago",
      },
      {
        id: 3,
        type: "comment",
        user: "Emma Wilson",
        action: "commented on your post",
        time: "1 hour ago",
      },
    ]);
  }, []);

  const menuSections = [
    {
      title: "Your Space",
      items: [
        { name: "Profile", icon: "👤", path: "/profile", badge: null },
        { name: "Friends", icon: "👥", path: "/friends", badge: "12" },
        { name: "Memories", icon: "🕒", path: "/memories", badge: null },
        { name: "Saved", icon: "📑", path: "/saved", badge: "5" },
        { name: "Groups", icon: "👪", path: "/groups", badge: "3" },
      ],
    },
    {
      title: "Explore",
      items: [
        { name: "Feeds", icon: "📰", path: "/feeds", badge: "new" },
        { name: "Watch", icon: "📺", path: "/watch", badge: "live" },
        { name: "Marketplace", icon: "🛍️", path: "/marketplace", badge: null },
        { name: "Events", icon: "📅", path: "/events", badge: "2" },
        { name: "Vignettes", icon: "🎬", path: "/vignettes", badge: null },
      ],
    },
    {
      title: "Entertainment",
      items: [
        { name: "Games", icon: "🎮", path: "/games", badge: null },
        { name: "Music", icon: "🎵", path: "/music", badge: null },
        { name: "Library", icon: "📚", path: "/library", badge: null },
        { name: "Movies", icon: "🎥", path: "/movies", badge: null },
        { name: "Podcasts", icon: "🎙️", path: "/podcasts", badge: "new" },
      ],
    },
    {
      title: "Professional",
      items: [
        { name: "Analytics", icon: "📊", path: "/analytics", badge: "pro" },
        { name: "Ads Manager", icon: "📢", path: "/ads-manager", badge: null },
        { name: "Business Suite", icon: "💼", path: "/business", badge: null },
        { name: "Jobs", icon: "💼", path: "/jobs", badge: "8" },
      ],
    },
  ];

  const quickActions = [
    {
      name: "Create Post",
      icon: "✏️",
      path: "/create-post",
      color: themeColor,
    },
    { name: "Live Stream",  icon: "🔴", path: "/live", color: "#ff4757",onClick: () => navigate('/live')},
    { name: "Story", icon: "📖", path: "/story", color: "#ffa502" },
    { name: "Event", icon: "🎉", path: "/create-event", color: "#2ed573" },
    { name: "Poll", icon: "📊", path: "/create-poll", color: "#3742fa" },
    { name: "Room", icon: "🎤", path: "/create-room", color: "#ff6b81" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
    console.log("Searching for:", query);
  };

  return (
    <div className="left-sidebar">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} themeColor={themeColor} />

      {/* User Profile Section */}
      <UserProfile user={currentUser} themeColor={themeColor} />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Online Friends */}
      <OnlineFriends friends={onlineFriends} />

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />

      {/* Menu Sections */}
      <div className="menu-sections">
        {menuSections.map((section, index) => (
          <MenuSection key={index} section={section} themeColor={themeColor} />
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="text-center">
          <small className="text-muted">
            IGSSAX &copy; {new Date().getFullYear()}
          </small>
          <div className="mt-2">
            <button
              className="btn-theme btn-sm"
              style={{ backgroundColor: themeColor }}
            >
              ✨ Premium Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
