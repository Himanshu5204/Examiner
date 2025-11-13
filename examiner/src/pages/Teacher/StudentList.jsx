import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
const StudentList = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [students, setStudents] = useState(location.state?.students || []);

    const getStudent = async () => {
        try {
            const crs = user.course_id;
            const dept = user.dept_code;
            // const res = await fetch('http://localhost:8000/api/teacher/studentsStatus');
            const res = await fetch('http://localhost:8000/api/teacher/studentsStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crs,
                    dept,
                }),
            });
            // const res = await fetch("http://localhost:8000/api/teacher/studentsStatus");
            const studentData = await res.json();
            console.log(studentData);
            setStudents(studentData);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        if (students.length === 0) {
            getStudent();
        }
    }, []); // run once

    return (
        <div className="bg-white p-4 rounded-2xl shadow">
            <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate(-1)} // -1 means go back
            >
                Go Back
            </button>

            <h3 className="text-lg text-center font-semibold mb-4">My Students</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th>No.</th>
                        <th>Enrollment</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="py-1">{i + 1}</td>
                            <td className="py-2">{s.student_id}</td>
                            <td>{s.email}</td>
                            <td>
                                <span className={`text-sm px-2 py-1 rounded-full ${s.loggedin === true ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {s.loggedin == true ? "Active" : "In-active"}
                                </span>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default StudentList