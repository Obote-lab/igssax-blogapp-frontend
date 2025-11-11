import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { reactionsAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useWebSocket } from "../../context/WebSocketContext";
import "./Reactions.css";

const REACTIONS = [
  { type: "like", icon: <FaThumbsUp color="#1877F2" />, label: "Like" },
  { type: "love", icon: <FaHeart color="#F33E58" />, label: "Love" },
  { type: "haha", icon: <FaLaugh color="#F7B125" />, label: "Haha" },
  { type: "wow", icon: <FaSurprise color="#F7B125" />, label: "Wow" },
  { type: "sad", icon: <FaSadTear color="#F7B125" />, label: "Sad" },
  { type: "angry", icon: <FaAngry color="#E9710F" />, label: "Angry" },
];

export default function Reactions({ contentType, objectId, initialSummary }) {
  const { user } = useAuth();
  const { sendMessage, subscribe } = useWebSocket();
  const [summary, setSummary] = useState(initialSummary || {});
  const [userReaction, setUserReaction] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const timerRef = useRef(null);

  // 🔄 Load user's reaction on mount
  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const res = await reactionsAPI.getUserReaction(contentType, objectId);
        if (res.data?.reaction_type) {
          setUserReaction(res.data.reaction_type);
        }
      } catch (err) {
        console.error("Failed to load reaction:", err);
      }
    };
    fetchReaction();
  }, [contentType, objectId]);

  // 🕸️ Subscribe to real-time reaction updates
  useEffect(() => {
    const unsubscribe = subscribe(
      `reaction_${contentType}_${objectId}`,
      (data) => {
        if (data?.type === "REACTION_UPDATE") {
          setSummary(data.payload);
        }
      }
    );
    return unsubscribe;
  }, [subscribe, contentType, objectId]);

  // 💥 Add or toggle reaction
  const handleReaction = async (type) => {
    try {
      if (userReaction === type) {
        await reactionsAPI.removeReaction(contentType, objectId);
        setUserReaction(null);
      } else {
        await reactionsAPI.addReaction(contentType, objectId, type);
        setUserReaction(type);
      }
    } catch (err) {
      console.error("Failed to update reaction:", err);
    }
  };

  // 🕒 Handle popover timing
  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowPopover(true), 400);
  };
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowPopover(false);
  };

  return (
    <div
      className="reactions-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- Main Like button --- */}
      <motion.button
        className={`reaction-main-btn ${userReaction ? "active" : ""}`}
        onClick={() => handleReaction("like")}
        data-tooltip-id="like-tooltip"
      >
        <FaThumbsUp className="reaction-icon" />
        {userReaction
          ? userReaction.charAt(0).toUpperCase() + userReaction.slice(1)
          : "Like"}
      </motion.button>
      <Tooltip id="like-tooltip" place="top" content="Like" />

      {/* --- Popover for all reactions --- */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            className="reaction-popover"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {REACTIONS.map((r, index) => (
              <motion.button
                key={r.type}
                className="reaction-btn"
                onClick={() => handleReaction(r.type)}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.9 }}
                data-tooltip-id={`tooltip-${r.type}`}
              >
                {r.icon}
                <Tooltip
                  id={`tooltip-${r.type}`}
                  place="top"
                  content={r.label}
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Summary counts --- */}
      {Object.keys(summary).length > 0 && (
        <div className="reaction-summary">
          {Object.entries(summary).map(([type, count]) => (
            <span key={type} className="reaction-count">
              {REACTIONS.find((r) => r.type === type)?.icon} {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
