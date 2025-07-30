import { CalendarDays } from 'lucide-react';

const EventCalendar = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Event Calendar</h3>
      <div className="text-sm text-gray-600">July 2023</div>
      <CalendarDays className="mt-4 w-20 h-20 text-blue-500 mx-auto" />
      {/* Use react-calendar if needed */}
    </div>
  );
};
export default EventCalendar;
