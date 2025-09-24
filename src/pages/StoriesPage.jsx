import { useEffect, useState } from "react";
import { storiesAPI } from "../api/axios";

function StoriesPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await storiesAPI.getStories();
        setStories(data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Stories</h2>
      <div className="d-flex flex-wrap gap-3">
        {stories.length === 0 ? (
          <p className="text-muted">No active stories.</p>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="card p-2"
              style={{ width: "120px", textAlign: "center" }}
            >
              <img
                src={story.media}
                alt="story"
                className="rounded mb-2"
                style={{ width: "100%", height: "100px", objectFit: "cover" }}
              />
              <small className="text-muted">{story.author}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StoriesPage;
