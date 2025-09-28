import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const GenderPieChart = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const COLORS = ["#3B82F6", "#F472B6"];

  const fetchGender = async (Id, code) => {
    const payload = {
      course_id: Id,
      dept_code: code
    }

    const res = await fetch('http://localhost:8000/api/teacher/gender/',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    console.log(data);
    setTotal(data.total);
    setMale(data.totalMale);
    setFemale(data.totalFemale
    );
  }

  useEffect(() => {
    fetchGender(user.course_id, user.dept_code);
  }, []);
  const chartData = [
    { name: "Boys", value: male },
    { name: "Girls", value: female },
  ];

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-lg font-semibold mb-2"> Course: {user.course_id}</h3>
      <div className="text-3xl font-bold mb-1">Total: {male + female}</div>
      <p className="text-sm text-gray-600">Boys: {male} | Girls: {female}</p>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenderPieChart;