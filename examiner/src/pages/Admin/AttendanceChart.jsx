import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = () => {
  const data = [
    { day: 'Mon', present: 300, absent: 80 },
    { day: 'Tue', present: 280, absent: 60 },
    { day: 'Wed', present: 270, absent: 50 },
    { day: 'Thu', present: 320, absent: 70 },
    { day: 'Fri', present: 310, absent: 40 },
    { day: 'Sat', present: 290, absent: 55 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Attendance</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#2563EB" />
          <Bar dataKey="absent" fill="#34D399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default AttendanceChart;
