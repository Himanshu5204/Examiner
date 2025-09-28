// src/pages/Teacher/StudentPerformanceChart.jsx
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GenderPieChart from './Analytics/GenderPieChart';

const data = [
  { name: 'Ankit', marks: 78 },
  { name: 'Priya', marks: 92 },
  { name: 'Ravi', marks: 65 },
  { name: 'Ayesha', marks: 85 },
];

const StudentPerformanceChart = () => {
  return (
    <GenderPieChart />
  );
};

export default StudentPerformanceChart;
