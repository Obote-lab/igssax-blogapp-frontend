import { FaArrowUp, FaArrowDown, FaMinus, FaHashtag } from "react-icons/fa";

function TrendingTopics() {
  const trends = [
    { id: 1, tag: "#TechInnovation", posts: "45.2K", trend: "up" },
    { id: 2, tag: "#SustainableLiving", posts: "38.7K", trend: "up" },
    { id: 3, tag: "#DigitalArt", posts: "32.1K", trend: "same" },
    { id: 4, tag: "#RemoteWork", posts: "28.9K", trend: "down" },
    { id: 5, tag: "#AIRevolution", posts: "25.4K", trend: "up" },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up") return <FaArrowUp className="text-success" />;
    if (trend === "down") return <FaArrowDown className="text-danger" />;
    return <FaMinus className="text-muted" />;
  };

  return (
    <div className="trending-topics">
      <h6 className="section-title">
        <FaHashtag className="me-2" />
        Trending Worldwide
      </h6>
      <div className="trends-list">
        {trends.map((trend, index) => (
          <div key={trend.id} className="trend-item">
            <div className="trend-rank">#{index + 1}</div>
            <div className="trend-content">
              <div className="trend-tag">{trend.tag}</div>
              <div className="trend-stats">
                <span className="trend-posts">{trend.posts} posts</span>
                {getTrendIcon(trend.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingTopics;
