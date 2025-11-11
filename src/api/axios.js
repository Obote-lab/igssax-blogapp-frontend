import axios from "axios";

//
// Axios instance
//
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

//
// Request interceptor: attach access token
//
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//
// Response interceptor: handle refresh on 401
//
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Attempt to refresh
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/users/auth/token/refresh/",
          { refresh },
          { headers: { "Content-Type": "application/json" } }
        );

        localStorage.setItem("access", data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();

        // Let React handle it gracefully
        console.warn("Session expired, please log in again.");
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

//
// Auth API
//
export const authAPI = {
  login: (credentials) => api.post("users/auth/login/", credentials),
  register: (userData) => api.post("users/auth/register/", userData),
  logout: () => api.post("users/auth/logout/"),
  refresh: (refresh) => api.post("users/auth/token/refresh/", { refresh }),
  verify: (token) => api.post("users/auth/token/verify/", { token }),

  // Password
  changePassword: (data) => api.post("users/auth/password/change/", data),
  forgotPassword: (email) => api.post("users/auth/password/reset/", { email }),
  resetPassword: (uid, token, data) =>
    api.post(`users/auth/password/reset/confirm/${uid}/${token}/`, data),
  // Google OAuth
  googleLogin: (data) => api.post("users/auth/google/login/", data),
  googleSignup: (data) => api.post("users/auth/google/signup/", data),
};

export const usersAPI = {
  getUser: (userId) => api.get(`users/users/${userId}/`),
  getMe: () => api.get("users/user/me/"),

  // Alias for getMe for consistency
  getProfile: (userId) => {
    if (userId === "me" || !userId) {
      return api.get("users/user/me/");
    } else {
      return api.get(`users/users/${userId}/`);
    }
  },
  updateProfile: (formData) => api.patch("users/user/me/", formData),

  updateProfilePicture: (formData, method = "patch") =>
    api[method]("users/user/me/", formData),

  // Search users
  searchUsers: (query) => api.get(`users/users/?search=${query}`),

  // 🔒 Privacy Settings
  getPrivacySettings: () => api.get("users/privacy-settings/"),
  updatePrivacySettings: (data) => api.patch("users/privacy-settings/", data),

  // 🚫 Block/Unblock Users
  blockUser: (userId) => api.post(`users/users/${userId}/block/`),
  unblockUser: (userId) => api.post(`users/users/${userId}/unblock/`),
  getBlockedUsers: () => api.get("users/blocked-users/"),

  // 👥 User Relationships
  getFriends: (userId) => api.get(`users/users/${userId}/friends/`),
  getPendingRequests: (userId) =>
    api.get(`users/users/${userId}/pending_requests_received/`),
  getSentRequests: (userId) =>
    api.get(`users/users/${userId}/pending_requests_sent/`),

  // Follow/Unfollow
  followUser: (userId) => api.post(`users/users/${userId}/follow/`),
  unfollowUser: (userId) => api.post(`users/users/${userId}/unfollow/`),
};

//
// 🔒 Privacy & Blocking API
//
export const privacyAPI = {
  // Privacy Settings
  getSettings: () => api.get("users/privacy-settings/"),
  updateSettings: (data) => api.patch("users/privacy-settings/", data),

  // Blocked Users Management
  getBlockedUsers: () => api.get("users/blocked-users/"),
  blockUser: (userId, reason = "") =>
    api.post("users/blocked-users/", {
      user_id: userId,
      reason,
    }),
  unblockUser: (userId) => api.delete(`users/blocked-users/${userId}/`),

  // Quick block/unblock via user endpoint
  quickBlock: (userId) => api.post(`users/users/${userId}/block/`),
  quickUnblock: (userId) => api.post(`users/users/${userId}/unblock/`),
};

//
// Settings API
//
export const settingsAPI = {
  getSettings: () => api.get("users/settings/"),
  updateSettings: (data) => api.patch("users/settings/", data),
};

//
// Friendship API
//
export const friendsAPI = {
  list: () => api.get("users/friendships/"),
  sendRequest: (receiverId) =>
    api.post("users/friendships/", { receiver: receiverId }),
  accept: (friendshipId) =>
    api.post(`users/friendships/${friendshipId}/accept/`),
  decline: (friendshipId) =>
    api.post(`users/friendships/${friendshipId}/decline/`),

  // Blocking (convenience methods)
  blockUser: (userId) => api.post(`users/users/${userId}/block/`),
  unblockUser: (userId) => api.post(`users/users/${userId}/unblock/`),
  getBlockedList: () => api.get("users/blocked-users/"),
};

//  Posts API
export const postsAPI = {
  // Fetch all posts (supports filtering & pagination)
  getPosts: (params = {}) => api.get("/posts/posts/", { params }),
  // Create a new post (text + media + tags)
  createPost: (data) =>
    api.post("/posts/posts/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // Retrieve a specific post
  getPost: (id) => api.get(`/posts/posts/${id}/`),
  // Update post
  updatePost: (id, data) =>
    api.put(`/posts/posts/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Delete post
  deletePost: (id) => api.delete(`/posts/posts/${id}/`),

  // Optional: Get current user's posts
  getMyPosts: () => api.get("/posts/posts/my_posts/"),
};

// 🎬 Stories API
export const storiesAPI = {
  getStories: () => api.get("/stories/"),

  createStory: (data) =>
    api.post("/stories/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteStory: (id) => api.delete(`/stories/${id}/`),
  // Optional: get only active stories (from your custom endpoint)
  getActiveStories: () => api.get("/stories/active/"),
};

// Comments API
export const commentsAPI = {
  getComments: (postId) => api.get(`comments/comments/?post=${postId}`),
  // Create a new comment (top-level or reply if parent included)
  createComment: (data) => api.post("comments/comments/", data),
  // Update a comment
  updateComment: (id, data) => api.put(`comments/comments/${id}/`, data),

  // Delete a comment
  deleteComment: (id) => api.delete(`comments/comments/${id}/`),

  // Reply to a comment (just a shortcut wrapper)
  replyToComment: (postId, parentId, content) =>
    api.post("comments/comments/", { post: postId, parent: parentId, content }),

  // Get a single comment with replies
  getCommentThread: (id) => api.get(`comments/comments/${id}/`),
};

//
// Reactions API
//
export const reactionsAPI = {
  // Toggle a reaction (like/unlike, etc.)
  toggleReaction: (data) => api.post("reactions/reactions/toggle/", data),

  // Legacy: Add a reaction (use toggleReaction instead)
  addReaction: (data) => api.post("reactions/reactions/", data),

  // Remove a reaction by ID
  removeReaction: (id) => api.delete(`reactions/reactions/${id}/`),

  // List reactions for a post
  getPostReactions: (postId) => api.get(`reactions/reactions/?post=${postId}`),

  // List reactions for a comment
  getCommentReactions: (commentId) =>
    api.get(`reactions/reactions/?comment=${commentId}`),
};

export const sharesAPI = {
  //  Toggle share (share/unshare)
  toggleShare: (data) => api.post("posts/shares/toggle/", data),

  // Create a share (if not toggling)
  addShare: (data) => api.post("posts/shares/", data),

  // Remove a specific share by ID
  removeShare: (id) => api.delete(`posts/shares/${id}/`),

  // Get all shares for a post
  getPostShares: (postId) => api.get(`posts/shares/?post=${postId}`),

  // //  Get all shares by a specific user (optional)
  // getUserShares: (userId) => api.get(`posts/shares/?user=${userId}`),

  // // Get total share count for a post (optional endpoint)
  // getPostShareCount: (postId) => api.get(`posts/shares/count/?post=${postId}`),
};


// ========================
// Livestream API
// ========================
export const livestreamAPI = {
  // STREAM MANAGEMENT
  getStreams: (params = {}) => api.get("livestream/streams/", { params }),
  getStream: (streamId) => api.get(`livestream/streams/${streamId}/`),
  createStream: (data) => api.post("livestream/streams/", data),
  updateStream: (streamId, data) =>
    api.patch(`livestream/streams/${streamId}/`, data),
  deleteStream: (streamId) => api.delete(`livestream/streams/${streamId}/`),

  // STREAM ACTIONS
  startStream: (streamId) =>
    api.post(`livestream/streams/${streamId}/start_stream/`),
  endStream: (streamId) =>
    api.post(`livestream/streams/${streamId}/end_stream/`),
  joinStream: (streamId) => api.post(`livestream/streams/${streamId}/join/`),
  leaveStream: (streamId) => api.post(`livestream/streams/${streamId}/leave/`),
  reportStream: (streamId, reason = "") =>
    api.post(`livestream/streams/${streamId}/report/`, { reason }),
  addModerator: (streamId, userId) =>
    api.post(`livestream/streams/${streamId}/add_moderator/`, {
      user_id: userId,
    }),

  // STREAM DISCOVERY
  getLiveStreams: () => api.get("livestream/public/v1/streams/live/"),
  getPublicStreams: () => api.get("livestream/public/v1/streams/"),
  getPublicLiveStreams: () => api.get("livestream/public/v1/streams/live/"),
  getFeaturedStreams: () => api.get("livestream/v1/streams/featured/"),
  getCategories: () => api.get("livestream/v1/streams/categories/"),
  getStreamParticipants: (streamId) =>
    api.get(`livestream/streams/${streamId}/participants/`),

  // CHAT MESSAGES
  getMessages: (streamId) =>
    api.get("livestream/messages/", { params: { stream: streamId } }),
  sendMessage: (data) => api.post("livestream/messages/", data),
  updateMessage: (messageId, data) =>
    api.patch(`livestream/messages/${messageId}/`, data),
  deleteMessage: (messageId) => api.delete(`livestream/messages/${messageId}/`),
  moderateMessage: (messageId) =>
    api.post(`livestream/messages/${messageId}/moderate/`),
  flagMessage: (messageId) =>
    api.post(`livestream/messages/${messageId}/flag/`),

  // STREAM REACTIONS
  getReactions: (streamId) =>
    api.get("livestream/reactions/", { params: { stream: streamId } }),
  addReaction: (data) => api.post("livestream/reactions/", data),
  removeReaction: (reactionId) =>
    api.delete(`livestream/reactions/${reactionId}/`),

  // MODERATION & BANS
  getBans: (streamId) =>
    api.get("livestream/bans/", { params: { stream: streamId } }),
  banUser: (data) => api.post("livestream/bans/", data),
  unbanUser: (banId) => api.post(`livestream/bans/${banId}/unban/`),
  deleteBan: (banId) => api.delete(`livestream/bans/${banId}/`),

  // ANALYTICS
  getAnalytics: () => api.get("livestream/analytics/"),
  getStreamAnalytics: (streamId) =>
    api.get(`livestream/analytics/?stream=${streamId}`),
  getAnalyticsSummary: () => api.get("livestream/analytics/summary/"),

  // HEALTH
  healthCheck: () => api.get("livestream/public/v1/health/"),
};


// ========================
// WebSocket Connection Helper
// ========================
// Livestream WebSocket
export const livestreamWebSocket = {
  connect: (streamId) => {
    const token = localStorage.getItem("access");
    const wsUrl = `ws://127.0.0.1:8000/ws/stream/${streamId}/?token=${token}`;
    return new WebSocket(wsUrl);
  },
  messageTypes: {
    CHAT_MESSAGE: "chat_message",
    REACTION: "reaction",
    VIEWER_COUNT_UPDATE: "viewer_count_update",
    STREAM_STATUS_UPDATE: "stream_status_update",
    STREAM_CONTROL: "stream_control",
    VIEWER_HEARTBEAT: "viewer_heartbeat",
    TYPING_INDICATOR: "typing_indicator",
    STREAM_INFO: "stream_info",
    SYSTEM_MESSAGE: "system_message",
    ERROR: "error",
  },
  createChatMessage: (content) => ({ type: "chat_message", content }),
  createReaction: (reactionType) => ({ type: "reaction", reaction_type: reactionType }),
  createStreamControl: (action, data = {}) => ({ type: "stream_control", action, ...data }),
  createViewerHeartbeat: () => ({ type: "viewer_heartbeat" }),
  createTypingIndicator: (isTyping) => ({ type: "typing_indicator", is_typing: isTyping }),
};
// ========================
// Stream Utilities
// ========================
export const streamUtils = {
  generateRTMPUrl: (streamKey) => {
    const base = import.meta.env.VITE_RTMP_BASE_URL || "rtmp://127.0.0.1:1935/live/";
    return `${base}${streamKey}`;
  },
  generatePlaybackUrl: (streamId) => {
    const base = import.meta.env.VITE_PLAYBACK_BASE_URL || "http://127.0.0.1:8000/hls/";
    return `${base}${streamId}.m3u8`;
  },
  formatDuration: (duration) => {
    if (!duration) return "00:00:00";
    let totalSeconds = duration;
    if (typeof duration === "string") {
      const parts = duration.split(":");
      if (parts.length === 3) {
        totalSeconds =
          parseInt(parts[0]) * 3600 +
          parseInt(parts[1]) * 60 +
          parseInt(parts[2]);
      }
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  },
  formatViewerCount: (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  },
  isStreamLive: (stream) => stream?.status === "live",
  isStreamScheduled: (stream) =>
    stream?.status === "scheduled" && stream?.scheduled_for,
  canViewStream: (stream, currentUser) => {
    if (!stream) return false;
    if (stream.privacy === "public") return true;
    if (!currentUser) return false;
    if (stream.privacy === "private" && stream.streamer?.id === currentUser.id)
      return true;
    if (stream.privacy === "friends") return true; 
    return false;
  },
  isStreamer: (stream, user) => stream?.streamer?.id === user?.id,
  isModerator: (stream, user) =>
    stream?.participants?.some(
      (p) => p.user?.id === user.id && p.role === "moderator" && !p.left_at
    ) || false,
  getStatusColor: (status) => {
    const colors = {
      live: "danger",
      scheduled: "warning",
      ended: "secondary",
      cancelled: "dark",
    };
    return colors[status] || "secondary";
  },
  getPrivacyIcon: (privacy) => {
    const icons = {
      public: "🌐",
      friends: "👥",
      private: "🔒",
    };
    return icons[privacy] || "🔒";
  },
  getTimeUntilStream: (scheduledFor) => {
    if (!scheduledFor) return null;
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diffMs = scheduled - now;
    if (diffMs <= 0) return "Starting soon";
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `In ${days}d ${hours}h`;
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  },
};


// Notifications WebSocket
export const notificationsWebSocket = {
  connect: (userId) => {
    const token = localStorage.getItem("access");
    const wsUrl = `ws://127.0.0.1:8000/ws/notifications/${userId}/?token=${token}`;
    return new WebSocket(wsUrl);
  },
};

//
// 🔧 Utils
//
export const setAuthTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const isAuthenticated = () => !!localStorage.getItem("access");

export default api;
