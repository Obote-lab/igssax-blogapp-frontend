import { FaSun, FaCloud, FaMapMarkerAlt } from "react-icons/fa";

function WeatherWidget() {
  const weather = {
    location: "Homa Bay, H/B",
    temperature: "26°",
    condition: "Sunny",
    high: "27°",
    low: "15°",
    icon: <FaSun className="text-warning" />,
  };

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <FaMapMarkerAlt className="me-1" />
        <span className="weather-location">{weather.location}</span>
      </div>
      <div className="weather-content">
        <div className="weather-icon">{weather.icon}</div>
        <div className="weather-info">
          <div className="weather-temp">{weather.temperature}</div>
          <div className="weather-condition">{weather.condition}</div>
          <div className="weather-range">
            H: {weather.high} • L: {weather.low}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;
