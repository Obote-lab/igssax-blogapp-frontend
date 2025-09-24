import axios from "axios";

//
// Axios instance
//
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", 
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

  //  Google OAuth
  googleLogin: (data) => api.post("users/auth/google/login/", data),
  googleSignup: (data) => api.post("users/auth/google/signup/", data),
};

//
// Users API
//
export const usersAPI = {
  // Get specific user by ID
  getUser: (userId) => api.get(`users/${userId}/`),

  // Get current authenticated user
  getMe: () => api.get("users/me/"),

  // Alias for getMe for consistency
  getProfile: (userId) => {
    if (userId === "me" || !userId) {
      return api.get("users/me/");
    } else {
      return api.get(`users/${userId}/`);
    }
  },

  updateProfile: (data) => api.patch("auth/profile/update/", data),

  updateProfilePicture: (formData) =>
    api.patch("auth/profile/update/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  searchUsers: (query) => api.get(`users/?search=${query}`), 
};

//
// Settings API
//
export const settingsAPI = {
  getSettings: () => api.get("settings/"),
  updateSettings: (data) => api.patch("settings/", data),
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
};

//
// Posts API
//
export const postsAPI = {
  getPosts: (params = {}) => api.get("posts/posts/", { params }),
  createPost: (data) =>
    api.post("posts/posts/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getPost: (id) => api.get(`posts/posts/${id}/`),
  updatePost: (id, data) => api.put(`posts/posts/${id}/`, data),
  deletePost: (id) => api.delete(`posts/posts/${id}/`),
};

//
// 🔧 Stories API
//
export const storiesAPI = {
  getStories: () => api.get("stories/"),
  createStory: (data) =>
    api.post("stories/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteStory: (id) => api.delete(`stories/${id}/`),
};

//
// 🔧 Comments API
//
export const commentsAPI = {
  // List comments for a post
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

// 🔧 Reactions API
export const reactionsAPI = {
  // ✅ Toggle a reaction (like/unlike, etc.)
  toggleReaction: (data) => api.post("reactions/reactions/toggle/", data),

  // Legacy: Add a reaction (use toggleReaction instead)
  addReaction: (data) => api.post("reactions/reactions/", data),

  // Remove a reaction by ID
  removeReaction: (id) => api.delete(`reactions/reactions/${id}/`),

  // List reactions for a post
  getPostReactions: (postId) =>
    api.get(`reactions/reactions/?post=${postId}`),

  // List reactions for a comment
  getCommentReactions: (commentId) =>
    api.get(`reactions/reactions/?comment=${commentId}`),
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
