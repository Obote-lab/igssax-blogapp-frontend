// components/livestream/StreamContainer.jsx
import { useParams } from "react-router-dom";
import { StreamProvider } from "../../context/StreamContext";
import StreamNavbar from "./StreamNavbar/StreamNavbar";
import StreamLeftSidebar from "./StreamLeftSidebar/StreamLeftSidebar";
import StreamMainContent from "./StreamMainContent/StreamMainContent";
import { useAuth } from "../../context/AuthContext";

function StreamContainer() {
  const { streamId } = useParams();
  const { currentUser } = useAuth();

  return (
    <StreamProvider streamId={streamId} currentUser={currentUser}>
      <div className="d-flex flex-column vh-100 bg-light">
        {/* Top Navbar */}
        <div className="border-bottom bg-white shadow-sm">
          <StreamNavbar streamId={streamId} />
        </div>

        {/* Main Content Area */}
        <div className="d-flex flex-grow-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className="border-end bg-white p-3 d-none d-md-block"
            style={{ width: "280px" }}
          >
            <StreamLeftSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-grow-1 p-3 overflow-auto">
            <StreamMainContent />
          </main>
        </div>
      </div>
    </StreamProvider>
  );
}

export default StreamContainer;
