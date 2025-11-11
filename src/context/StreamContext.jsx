// context/StreamContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { livestreamAPI } from "../api/axios";

const StreamContext = createContext();

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};

export const StreamProvider = ({ children, streamId, currentUser }) => {
  const [stream, setStream] = useState(null);
  const [streamStatus, setStreamStatus] = useState("offline");
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [activeScene, setActiveScene] = useState("default");
  const [activePanel, setActivePanel] = useState("chat");
  const [userRole, setUserRole] = useState("viewer");

  // Fetch stream data
  useEffect(() => {
    if (streamId) {
      fetchStream();
    }
  }, [streamId]);

  const fetchStream = async () => {
    try {
      const response = await livestreamAPI.getStream(streamId);
      const streamData = response.data;
      setStream(streamData);
      setStreamStatus(streamData.status);
      setViewers(streamData.viewer_count);

      // Determine user role
      if (currentUser && streamData.streamer === currentUser.id) {
        setUserRole("streamer");
      } else {
        setUserRole("viewer");
      }
    } catch (error) {
      console.error("Failed to fetch stream:", error);
    }
  };

  const startStream = async (streamId) => {
    try {
      await livestreamAPI.startStream(streamId);
      setStreamStatus("live");
      // Refresh stream data
      fetchStream();
    } catch (error) {
      console.error("Failed to start stream:", error);
      throw error;
    }
  };

  const endStream = async (streamId) => {
    try {
      await livestreamAPI.endStream(streamId);
      setStreamStatus("ended");
      // Refresh stream data
      fetchStream();
    } catch (error) {
      console.error("Failed to end stream:", error);
      throw error;
    }
  };

  const value = {
    stream,
    streamStatus,
    viewers,
    chatMessages,
    reactions,
    activeScene,
    activePanel,
    userRole,
    setStream,
    setStreamStatus,
    setViewers,
    setChatMessages,
    setReactions,
    setActiveScene,
    setActivePanel,
    setUserRole,
    startStream,
    endStream,
    fetchStream,
  };

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};
