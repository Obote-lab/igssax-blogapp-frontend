import { useState } from "react";

const AdvancedOptions = ({
  scheduledTime,
  setScheduledTime,
  location,
  setLocation,
  mood,
  setMood,
  feeling,
  setFeeling,
  onClose,
  themeColor,
}) => {
  const moods = [
    "😊 Happy",
    "😢 Sad",
    "😡 Angry",
    "😮 Surprised",
    "😍 Loving",
    "😂 Laughing",
    "🤔 Thinking",
    "😴 Tired",
  ];
  const feelings = [
    "🎉 Celebrating",
    "💪 Accomplished",
    "🙏 Grateful",
    "❤️ Loving",
    "🌟 Inspired",
    "😌 Peaceful",
    "🔥 Excited",
    "🎯 Focused",
  ];

  return (
    <div className="advanced-options">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: themeColor }}>
          Advanced Options
        </h6>
        <button
          className="btn-close"
          onClick={onClose}
          style={{ color: themeColor }}
        ></button>
      </div>

      <div className="option-group">
        <label className="option-label">Schedule Post</label>
        <input
          type="datetime-local"
          className="option-input"
          value={scheduledTime ? scheduledTime.toISOString().slice(0, 16) : ""}
          onChange={(e) => setScheduledTime(new Date(e.target.value))}
        />
      </div>

      <div className="option-group">
        <label className="option-label">Location</label>
        <input
          type="text"
          className="option-input"
          placeholder="📍 Add location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="option-group">
        <label className="option-label">Mood</label>
        <select
          className="option-input"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">Select mood</option>
          {moods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>

      <div className="option-group">
        <label className="option-label">Feeling/Activity</label>
        <select
          className="option-input"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        >
          <option value="">Select feeling</option>
          {feelings.map((feeling) => (
            <option key={feeling} value={feeling}>
              {feeling}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdvancedOptions;
