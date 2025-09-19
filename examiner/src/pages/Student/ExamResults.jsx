import { useEffect, useState } from 'react';
import { useAuth } from './../Context/AuthContext';

// src/pages/Student/ExamResults.jsx
const ExamResults = () => {
  const { user } = useAuth();
  const [result, setResult] = useState([]);
  const getResult = async () => {

    const res = await fetch(`http://localhost:8000/api/student/result/${user.student_id}`);
    const serverData = await res.json();
    console.log(serverData);
    setResult(serverData);
  }

  useEffect(() => {
    getResult();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Exam Results</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Subject</th>
            <th>Date</th>
            <th>Score</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {result.map((r, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2">{r.Name} </td>
              <td className="py-2">{r.ExamDate}</td>
              <td>
                {
                  r.Score !== 'Absent' ? (r.Score + "/" + r.Total) : (r.Score)
                }
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                // onClick={() => navigate(`/exam/${exam.Id}/instructions`)}
                >
                  Answers
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamResults;
