import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import AccountSettings from "./Account/AccountSettings";
import PrivacySettings from "./Privacy/PrivacySettings";
import NotificationSettings from "./Notifications/NotificationSettings";
import DisplaySettings from "./Display/DisplaySettings";
import SecuritySettings from "./Security/SecuritySettings";
import SocialSettings from "./Social/SocialSettings";
import BillingSettings from "./Billing/BillingSettings";
import AccessibilitySettings from "./Accessibility/AccessibilitySettings";
import AdvancedSettings from "./Advanced/AdvancedSettings";
import Sidebar from "./Sidebar";
import "./Settings.css";

function SettingsPage() {
  const { theme } = useTheme();

  // Get theme color based on current theme
  const getThemeColor = () => {
    const root = document.documentElement;
    return (
      getComputedStyle(root).getPropertyValue("--accent-color").trim() ||
      "#73c2be"
    );
  };

  const themeColor = getThemeColor();

  return (
    <div
      className="container-fluid settings-page py-4"
      style={{ minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        {/* Header for Mobile */}
        <div className="col-12 d-lg-none mb-4">
          <div className="text-center">
            <h2 style={{ color: themeColor, fontWeight: "600" }}>Settings</h2>
            <p className="text-muted">Manage your account preferences</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-3 col-xl-2 mb-4">
          <Sidebar themeColor={themeColor} />
        </div>

        {/* Content */}
        <div className="col-lg-9 col-xl-10">
          <div
            className="card shadow-sm rounded-4 settings-content border-0"
            style={{
              minHeight: "600px",
            }}
          >
            <div className="card-header border-0 bg-transparent py-4">
              <div
                className="d-flex align-items-center mb-2"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "12px",
                  background: `linear-gradient(45deg, ${themeColor}15, ${themeColor}08)`,
                  borderLeft: `4px solid ${themeColor}`,
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: `${themeColor}20`,
                    color: themeColor,
                  }}
                >
                  <i className="fas fa-cog"></i>
                </div>
                <div>
                  <h4
                    className="mb-0"
                    style={{ color: themeColor, fontWeight: "600" }}
                  >
                    Account Settings
                  </h4>
                  <small className="text-muted">
                    Customize your experience and preferences
                  </small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <Routes>
                {/* Default -> redirect to account */}
                <Route index element={<Navigate to="account" replace />} />

                <Route path="account" element={<AccountSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
                <Route
                  path="notifications"
                  element={<NotificationSettings />}
                />
                <Route path="display" element={<DisplaySettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="social" element={<SocialSettings />} />
                <Route path="billing" element={<BillingSettings />} />
                <Route
                  path="accessibility"
                  element={<AccessibilitySettings />}
                />
                <Route path="advanced" element={<AdvancedSettings />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="account" replace />} />
              </Routes>
            </div>

            {/* Footer */}
            <div className="card-footer border-0 bg-transparent py-3">
              <div className="text-center">
                <small className="text-muted">
                  Need help?{" "}
                  <a
                    href="/help"
                    style={{ color: themeColor, textDecoration: "none" }}
                  >
                    Contact Support
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
