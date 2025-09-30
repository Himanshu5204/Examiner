import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as PieTooltip,
    Legend as PieLegend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as BarTooltip,
    Legend as BarLegend,
    ResponsiveContainer
} from "recharts";

const AdminExamResults = () => {
    const [data, setData] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    useEffect(() => {
        fetch("http://localhost:8000/api/admin/getResults/")
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.error(err));
    }, []);

    // Reset course and exam when dept changes
    useEffect(() => {
        setSelectedCourse("");
        setSelectedExam("");
    }, [selectedDept]);

    // Reset exam when course changes
    useEffect(() => {
        setSelectedExam("");
    }, [selectedCourse]);

    // Get unique departments
    const departments = [...new Set(data.map(d => d.dept))];

    // Get courses for selected department
    const coursesForDept = selectedDept
        ? [...new Set(data.filter(d => d.dept === selectedDept).map(d => d.course))]
        : [];

    // Get exams for selected course
    const examsForCourse = selectedCourse
        ? data.filter(d => d.dept === selectedDept && d.course === selectedCourse)
        : [];

    // Selected exam object
    const examData = selectedExam
        ? examsForCourse.find(d => d.exam_id === selectedExam)
        : null;

    // Pie chart data
    const pieData = examData
        ? [
            { name: "Attended", value: examData[selectedExam].attended_total },
            { name: "Not Attended", value: examData[selectedExam].not_attended_total },
        ]
        : [];

    // Bar chart data as percentage
    const barData = examData
        ? examData[selectedExam].attended.map(s => ({
            name: s.name,
            studentId: s.email, // ensure student_id is returned by your API
            score: Number(s.score),
            percentage: (Number(s.score) / examData[selectedExam].totalMarks) * 100
        }))
        : [];

    const COLORS = ["#0088FE", "#FF8042"];

    // Custom tooltip for bar chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border shadow rounded">
                    {/* <p><strong>Name:</strong> {data.name}</p> */}
                    {/* <p><strong>Student ID:</strong> {data.studentId}</p> */}
                    <p><strong>Score:</strong> {data.score}</p>
                    <p><strong>Percentage:</strong> {data.percentage.toFixed(2)}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6 bg-blue-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Admin Exam Results</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Department Dropdown */}
                <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="border p-2 rounded bg-white border-blue-500"
                >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                {/* Course Dropdown */}
                <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className={`border p-2 rounded ${!selectedDept ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400" : "bg-white border-blue-500"}`}
                    disabled={!selectedDept}
                >
                    <option value="">Select Course</option>
                    {coursesForDept.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {/* Exam Dropdown */}
                <select
                    value={selectedExam}
                    onChange={e => setSelectedExam(e.target.value)}
                    className={`border p-2 rounded ${!selectedCourse ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400" : "bg-white border-blue-500"}`}
                    disabled={!selectedCourse}
                >
                    <option value="">Select Exam</option>
                    {examsForCourse.map(e => (
                        <option key={e.exam_id} value={e.exam_id}>
                            {e.exam_id} - {e[selectedExam]?.date || "Exam Date"}
                        </option>
                    ))}
                </select>
            </div>

            {examData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white shadow rounded-xl p-6 text-center flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-4">Attendance</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={index} fill={color} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                                <PieLegend verticalAlign="bottom" layout="horizontal" align="center" />
                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white shadow rounded-xl p-6 text-center flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-4">Student Scores (%)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <BarTooltip content={<CustomTooltip />} />
                                <BarLegend />
                                <Bar
                                    dataKey="percentage"
                                    fill="#82ca9d"
                                    onClick={(data, index) => setSelectedStudent(barData[index])}
                                />
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-4 text-left">
                            {selectedStudent && (
                                <div className="mt-2 p-2 border rounded bg-white shadow flex flex-wrap gap-4">
                                    <span><strong>Name:</strong> {selectedStudent.name}</span>
                                    <span><strong>Email:</strong> {selectedStudent.studentId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!examData && selectedCourse && (
                <p className="text-gray-500">Select an exam to view charts</p>
            )}
        </div>
    );
};

export default AdminExamResults;
