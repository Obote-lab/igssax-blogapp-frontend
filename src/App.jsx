import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import StoriesPage from "./pages/StoriesPage";
import TagsPage from "./pages/TagsPage";
import ChatPage from "./pages/ChatPage";
import FriendsPage from "./pages/FriendsPage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./components/settings/SettingsPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./ThemeContext";

import AccountSettings from "./components/settings/Account/AccountSettings";
import PrivacySettings from "./components/settings/Privacy/PrivacySettings";
import NotificationSettings from "./components/settings/Notifications/NotificationSettings";
import DisplaySettings from "./components/settings/Display/DisplaySettings";
import SecuritySettings from "./components/settings/Security/SecuritySettings";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* My Profile */}
        <Route
          path="/profile"
          element={<Navigate to="/profile/me" replace />}
        />
        {/* Other User Profile */}
        <Route
          path="/profile/:userId"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Posts & Comments */}
        <Route
          path="/posts"
          element={isAuthenticated ? <PostsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts/:postId"
          element={
            isAuthenticated ? <PostDetailPage /> : <Navigate to="/login" />
          }
        />
        {/* Stories */}
        <Route
          path="/stories"
          element={isAuthenticated ? <StoriesPage /> : <Navigate to="/login" />}
        />
        {/* Tags */}
        <Route
          path="/tags"
          element={isAuthenticated ? <TagsPage /> : <Navigate to="/login" />}
        />
        {/* Friends */}
        <Route
          path="/friends"
          element={isAuthenticated ? <FriendsPage /> : <Navigate to="/login" />}
        />
        {/* Chat / Conversations */}
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        {/* Password reset */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route
          path="/settings/*"
          element={
            isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />
          }
        >
          {/* Default redirect when visiting /settings */}
          <Route index element={<Navigate to="account" replace />} />

          {/* Child routes */}
          <Route path="account" element={<AccountSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="display" element={<DisplaySettings />} />
          <Route path="security" element={<SecuritySettings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider> 
      </ThemeProvider>
    </Router>
  );
}

export default App;
