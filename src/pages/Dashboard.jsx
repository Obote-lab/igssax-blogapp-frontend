import Navbar from "../components/Navbar";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import Feed from "../components/dashboard/Feed";
import RightSidebar from "../components/dashboard/RightSidebar";
import  "./DashboardCSS.css";

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="container-fluid mt-4">
        <div className="row" style={{ height: "100vh" }}>
          {/* Left Sidebar */}
          <div className="col-3 d-none d-md-block sidebar-scroll">
            <LeftSidebar />
          </div>

          {/* Feed */}
          <div className="col-12 col-md-6 feed-scroll">
            <Feed />
          </div>

          {/* Right Sidebar */}
          <div className="col-3 d-none d-md-block sidebar-scroll">
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

