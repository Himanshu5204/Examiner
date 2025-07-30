// src/pages/Shared/EventCalendar.jsx
import { CalendarDays } from 'lucide-react';

const EventCalendar = () => {
  const events = [
    { date: '2025-08-10', title: 'Parent Meeting' },
    { date: '2025-08-14', title: 'Independence Day Prep' },
    { date: '2025-08-20', title: 'Science Fair' },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-blue-500" />
        <h3 className="text-lg font-semibold">Event Calendar</h3>
      </div>
      <ul className="space-y-2 text-sm">
        {events.map((event, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{event.title}</span>
            <span className="text-gray-500">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
