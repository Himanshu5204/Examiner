import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const GenderPieChart = () => {
  const [data, setData] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filtered, setFiltered] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/counts/")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  // Reset course when dept changes
  useEffect(() => {
    setSelectedCourse("");
  }, [selectedDept]);

  useEffect(() => {
    if (data && selectedDept && selectedCourse) {
      const match = data.deptWiseCount.find(
        item => item.course === selectedCourse && item.dept === selectedDept
      );
      setFiltered(match);
    }
  }, [selectedDept, selectedCourse, data]);

  if (!data) return <p>Loading chart...</p>;

  const COLORS = ["#0088FE", "#FF69B4"];

  // Get unique departments
  const departments = [...new Set(data.deptWiseCount.map(item => item.dept))];

  // Get courses for the selected department
  const coursesForDept = selectedDept
    ? data.deptWiseCount.filter(item => item.dept === selectedDept).map(item => item.course)
    : [];

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>

      <div className="flex gap-4 mb-6">
        {/* Department Dropdown */}
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Course Dropdown (depends on dept) */}
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          className={`p-2 rounded border ${!selectedDept
            ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400"
            : "bg-white border-blue-500"
            }`}
          disabled={!selectedDept}
        >
          <option value="">Select Course</option>
          {coursesForDept.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      {filtered && filtered.total > 0 ? (
        <PieChart width={400} height={300}>
          <Pie
            data={[
              { name: "Male", value: filtered.totalMale },
              { name: "Female", value: filtered.totalFemale }
            ]}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
          >
            {COLORS.map((color, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p className="text-gray-500">
          {selectedDept && selectedCourse
            ? "No data available for this selection."
            : "Select department and course to view chart."}
        </p>
      )}
    </div>
  );
};

export default GenderPieChart;
