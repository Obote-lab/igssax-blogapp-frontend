const BirthdayReminders = ({ birthdays, themeColor }) => {
  const getBirthdayText = (daysLeft) => {
    if (daysLeft === 0)
      return <span className="birthday-today">Today! 🎉</span>;
    if (daysLeft === 1) return "Tomorrow";
    return `In ${daysLeft} days`;
  };

  return (
    <div className="birthday-reminders">
      <div className="section-title">
        Birthday Reminders
        <a href="/birthdays" className="section-link">
          See All
        </a>
      </div>
      <div className="birthdays-list">
        {birthdays.map((birthday) => (
          <div key={birthday.id} className="birthday-item">
            <img
              src={birthday.avatar}
              alt={birthday.name}
              className="birthday-avatar"
            />
            <div className="birthday-info">
              <div className="birthday-name">{birthday.name}</div>
              <div className="birthday-days">
                {getBirthdayText(birthday.daysLeft)}
              </div>
            </div>
            <button
              className="btn-wish"
              style={{ backgroundColor: themeColor }}
            >
              Wish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayReminders;
