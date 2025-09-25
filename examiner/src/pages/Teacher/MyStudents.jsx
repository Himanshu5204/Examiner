import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// src/pages/Teacher/MyStudents.jsx
const MyStudents = () => {

  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const getStudent = async () => {
    const res = await fetch('http://localhost:8000/api/teacher/studentsStatus');
    const studentData = await res.json();
    console.log(studentData);
    setStudents(studentData);
  }

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">My Students</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Enrollment</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.slice(0, 3).map((s, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
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
      {
        students.length > 3 && (
          <div className="mt-4 flex justify-center">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/teacher/students", { state: { students } })}
            >
              More
            </button>
          </div>
        )
      }

    </div>
  );
};

export default MyStudents;
