import {
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaHashtag,
  FaFire,
} from "react-icons/fa";

import "./TrendingTopics.css"

function TrendingTopics() {
  const trends = [
    {
      id: 1,
      tag: "TechInnovation",
      posts: "45.2K",
      trend: "up",
      change: "+12.4%",
      category: "Technology",
    },
    {
      id: 2,
      tag: "SustainableLiving",
      posts: "38.7K",
      trend: "up",
      change: "+8.2%",
      category: "Lifestyle",
    },
    {
      id: 3,
      tag: "DigitalArt",
      posts: "32.1K",
      trend: "same",
      change: "0%",
      category: "Art",
    },
    {
      id: 4,
      tag: "RemoteWork",
      posts: "28.9K",
      trend: "down",
      change: "-3.1%",
      category: "Business",
    },
    {
      id: 5,
      tag: "AIRevolution",
      posts: "25.4K",
      trend: "up",
      change: "+15.7%",
      category: "Technology",
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up") return <FaArrowUp className="text-success" size={12} />;
    if (trend === "down")
      return <FaArrowDown className="text-danger" size={12} />;
    return <FaMinus className="text-muted" size={12} />;
  };

  const getTrendBadge = (trend) => {
    if (trend === "up") return "success";
    if (trend === "down") return "danger";
    return "secondary";
  };

  return (
    <div className="trending-topics">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaFire className="text-danger" />
          <h6 className="fw-bold mb-0 text-dark">Trending Worldwide</h6>
        </div>
        <span className="badge bg-primary rounded-pill">Live</span>
      </div>

      {/* Trends List */}
      <div className="d-flex flex-column gap-2">
        {trends.map((trend, index) => (
          <div key={trend.id} className="card border-0 shadow-sm trend-card">
            <div className="card-body p-3">
              <div className="d-flex align-items-start gap-3">
                {/* Rank Number */}
                <div className="text-center">
                  <div
                    className={`rank-number rank-${
                      index + 1
                    } rounded-circle d-flex align-items-center justify-content-center`}
                  >
                    <span className="fw-bold text-white">{index + 1}</span>
                  </div>
                </div>

                {/* Trend Content */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaHashtag className="text-primary" size={14} />
                    <span className="fw-bold text-dark trend-tag">
                      {trend.tag}
                    </span>
                    <span
                      className={`badge bg-${getTrendBadge(
                        trend.trend
                      )} bg-opacity-10 text-${getTrendBadge(
                        trend.trend
                      )} rounded-pill`}
                    >
                      {getTrendIcon(trend.trend)} {trend.change}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small">
                        {trend.posts} posts
                      </span>
                      <span className="text-muted small mx-2">•</span>
                      <span className="text-muted small">{trend.category}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center mt-3">
        <button className="btn btn-outline-secondary btn-sm rounded-pill px-4">
          Show more trends
        </button>
      </div>
    </div>
  );
}

export default TrendingTopics;
