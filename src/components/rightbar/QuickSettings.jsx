import { useState } from "react";

const QuickSettings = ({ themeColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const settingsOptions = [
    {
      icon: "🔕",
      label: "Mute notifications",
      action: () => console.log("Mute"),
    },
    { icon: "🌙", label: "Dark mode", action: () => console.log("Dark mode") },
    {
      icon: "🔒",
      label: "Privacy settings",
      action: () => console.log("Privacy"),
    },
    {
      icon: "⚡",
      label: "Performance",
      action: () => console.log("Performance"),
    },
  ];

  return (
    <div className="quick-settings">
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: themeColor }}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="settings-dropdown">
          {settingsOptions.map((option, index) => (
            <div
              key={index}
              className="settings-option"
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
            >
              <span className="settings-icon">{option.icon}</span>
              <span className="settings-label">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickSettings;
