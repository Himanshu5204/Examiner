import React, { useState, useEffect } from "react";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { useAuth } from "../../Context/AuthContext";

const COLORS = ["#3B82F6", "#F472B6"];

const StudentExamCharts = ({ id }) => {
    console.log(id);
    const { user } = useAuth();
    const [examData, setExamData] = useState({});
    const [selectedExam, setSelectedExam] = useState("");
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);

    // Fetch exam data from backend
    useEffect(() => {
        const fetchExamData = async () => {
            const payload = {
                course_id: user.course_id,
                dept_code: user.dept_code
            };
            const res = await fetch("http://localhost:8000/api/teacher/student-exam/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            console.log(data);
            setExamData(data);
        };
        fetchExamData();

    }, [user.course_id, user.dept_code]);

    // Update bar and pie data when selected exam changes
    useEffect(() => {
        if (selectedExam && examData[selectedExam]) {
            const exam = examData[selectedExam];

            // Bar chart: each student who attended
            const bar = exam.attended.map(s => ({
                student: s.name,
                score: Number(s.score),
                totalMarks: exam.totalMarks
            }));
            setBarData(bar);

            // Pie chart: attended vs not attended
            setPieData([
                { name: "Attended", value: exam.attended_total },
                { name: "Not Attended", value: exam.not_attended_total }
            ]);
        }
        console.log(examData[selectedExam])
        // setSelectedExam(examData[0].exam_id);
    }, [selectedExam, examData]);

    return (
        <div className="flex gap-8">
            {/* Left: Pie Chart */}
            <div className="w-1/3 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Student Mark's Distributuion</h3>
                <select
                    className="mb-4 p-2 border rounded w-full"
                    value={selectedExam}
                    onChange={e => setSelectedExam(e.target.value)}
                >
                    <option value="">Select Exam</option>
                    {Object.keys(examData).map(examId => (
                        <option key={examId} value={examId}>{examId}</option>

                    ))}
                </select>

                {pieData.length > 0 && (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}

                {
                    selectedExam && examData[selectedExam] && (
                        <div className="mt-4 text-center">
                            <div>
                                <span className="font-semibold">Date:</span>{" "}
                                <strong>{examData[selectedExam].date}</strong>
                            </div>
                            <div>
                                <span className="font-semibold">Total Students:</span>{" "}
                                <strong>{examData[selectedExam].total}</strong>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Right: Bar Chart */}
            <div className="w-2/3 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Student Scores</h3>
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="student" />
                            <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft", offset: -10 }}
                                tickFormatter={(value) => `${((value / examData[selectedExam].totalMarks) * 100).toFixed(0)}%`}
                            />
                            <Tooltip formatter={
                                (value, name, props) => {
                                    const percentage = ((value / props.payload.totalMarks) * 100).toFixed(2);
                                    return `${value}/${props.payload.totalMarks} (${percentage}%)`
                                }
                            } />
                            <Legend />
                            <Bar dataKey="score" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No students attended this exam yet.</p>
                )}
            </div>
        </div >
    );
};

export default StudentExamCharts;