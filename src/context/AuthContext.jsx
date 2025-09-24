// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { usersAPI } from "../api/axios";

// Create the context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on app start
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          const response = await usersAPI.getMe();
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        // Clear invalid tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  // Update user function
  const updateUser = (userData) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context itself if needed elsewhere
export default AuthContext;
