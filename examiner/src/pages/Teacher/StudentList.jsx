import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const StudentList = () => {
    const location = useLocation();
    const students = location.state?.students;
    const navigate = useNavigate();
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