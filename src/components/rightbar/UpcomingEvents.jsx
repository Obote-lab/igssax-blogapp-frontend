import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Tech Meetup 2024",
      date: "Mar 15, 2024",
      time: "6:00 PM",
      location: "Convention Center",
      type: "conference",
      attendees: 245,
    },
    {
      id: 2,
      title: "Community Yoga Session",
      date: "Mar 12, 2024",
      time: "8:00 AM",
      location: "Central Park",
      type: "wellness",
      attendees: 89,
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      date: "Mar 20, 2024",
      time: "2:00 PM",
      location: "Innovation Hub",
      type: "business",
      attendees: 156,
    },
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      conference: "#73c2be",
      wellness: "#4cd964",
      business: "#ff9500",
      social: "#ff3b30",
    };
    return colors[type] || "#73c2be";
  };

  return (
    <div className="upcoming-events">
      <h6 className="section-title">
        <FaCalendarAlt className="me-2" />
        Upcoming Events
      </h6>
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div
              className="event-type-indicator"
              style={{ backgroundColor: getEventTypeColor(event.type) }}
            ></div>
            <div className="event-content">
              <h6 className="event-title">{event.title}</h6>
              <div className="event-details">
                <div className="event-detail">
                  <FaCalendarAlt className="me-1" />
                  <span>{event.date}</span>
                </div>
                <div className="event-detail">
                  <FaClock className="me-1" />
                  <span>{event.time}</span>
                </div>
                <div className="event-detail">
                  <FaMapMarkerAlt className="me-1" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="event-footer">
                <span className="event-attendees">
                  {event.attendees} attending
                </span>
                <button className="btn-rsvp">RSVP</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingEvents;
