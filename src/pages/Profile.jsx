// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usersAPI, postsAPI } from "../api/axios";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import SidePanelLeft from "../components/profile/SidePanelLeft";
import SidePanelRight from "../components/profile/SidePanelRight";

function Profile() {
  const { userId } = useParams(); // /profile/:userId
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile + posts
  const fetchProfileData = async () => {
    try {
      setError("");
      setLoading(true);

      let userRes;

      // If it's "me" or no userId specified, get current user
      if (!userId || userId === "me") {
        userRes = await usersAPI.getMe(); // This calls /api/users/users/me/
      } else {
        // Get specific user by ID
        userRes = await usersAPI.getUser(userId); // This calls /api/users/users/{id}/
      }

      setUser(userRes.data);

      // Fetch user's posts
      const authorId = userRes.data.id;
      const postRes = await postsAPI.getPosts({ author: authorId });
      setPosts(postRes.data.results || postRes.data); // Handle both paginated and non-paginated responses
    } catch (err) {
      console.error("Error loading profile:", err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId, navigate]);

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!user) return <p className="text-center mt-5">User not found</p>;

  return (
    <div className="container-fluid mt-3">
      {/* Top Section */}
      <ProfileHeader user={user} onProfileUpdated={fetchProfileData} />

      <div className="row mt-4">
        {/* Left Sidebar */}
        <div className="col-lg-3 d-none d-lg-block">
          <SidePanelLeft user={user} onProfileUpdated={fetchProfileData} />
        </div>

        {/* Middle (Tabs + Content) */}
        <div className="col-lg-6">
          <ProfileTabs user={user} posts={posts} />
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-3 d-none d-lg-block">
          <SidePanelRight user={user} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
