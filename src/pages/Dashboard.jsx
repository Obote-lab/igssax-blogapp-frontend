import Navbar from "../components/Navbar";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import Feed from "../components/dashboard/Feed";
import RightSidebar from "../components/dashboard/RightSidebar";

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

      {/* Custom CSS */}
      <style>
              {`
          body {
            background-color: #f0f2f5; 
          }

          .sidebar-scroll, .feed-scroll {
            height: calc(100vh - 60px); 
            overflow-y: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .sidebar-scroll::-webkit-scrollbar,
          .feed-scroll::-webkit-scrollbar {
            display: none;
          }

          /* Feed Layout */
          .feed-container {
            max-width: 600px;
            margin: 0 auto;
          }

          .feed-card {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 15px;
          }
        `}
      </style>



    </>
  );
}

export default Dashboard;

