// src/pages/Teacher/StudentPerformanceChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ankit', marks: 78 },
  { name: 'Priya', marks: 92 },
  { name: 'Ravi', marks: 65 },
  { name: 'Ayesha', marks: 85 },
];

const StudentPerformanceChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="marks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentPerformanceChart;
