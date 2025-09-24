import { Routes, Route, Navigate } from "react-router-dom";
import AccountSettings from "./Account/AccountSettings";
import PrivacySettings from "./Privacy/PrivacySettings";
import NotificationSettings from "./Notifications/NotificationSettings";
import DisplaySettings from "./Display/DisplaySettings";
import SecuritySettings from "./Security/SecuritySettings";
import Sidebar from "./Sidebar";
import "./Settings.css";

function SettingsPage() {
  return (
    <div className="container-fluid settings-page py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-3">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="col-lg-9">
          <div className="card shadow-sm rounded-3 settings-content">
            <div className="card-body">
              <Routes>
                {/* Default -> Account */}
                <Route path="/" element={<Navigate to="account" replace />} />

                <Route path="account" element={<AccountSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
                <Route
                  path="notifications"
                  element={<NotificationSettings />}
                />
                <Route path="display" element={<DisplaySettings />} />
                <Route path="security" element={<SecuritySettings />} />

                {/* Catch invalid setting paths */}
                <Route path="*" element={<AccountSettings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
