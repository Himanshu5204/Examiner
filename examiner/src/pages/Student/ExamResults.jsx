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

  const downloadResult = async (examId) => {
    console.log(user.student_id, examId)
    const data = {
      "studentId": user.student_id,
      "examId": examId
    }
    // http://localhost:8000/api/student/result
    const res = await fetch('http://localhost:8000/api/student/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    // setMessage(data.message);
    console.log('result:', resData);
  }

  useEffect(() => {
    getResult();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Exam Results</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-center text-gray-500 border-b">
            <th>Subject</th>
            <th>Date</th>
            <th>Score</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {result.map((r, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2 text-center">{r.Name} </td>
              <td className="py-2 text-center">{r.ExamDate}</td>
              <td className="py-2 text-center">
                {
                  r.Score !== 'Absent' ? (r.Score + "/" + r.Total) : (r.Score)
                }
              </td>
              <td className="py-2 text-center">
                {
                  r.Score !== 'Absent'
                    ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => downloadResult(r.Id)}
                      >
                        Answers
                      </button>
                    ) : (
                      <div class="text-center">
                        <span>-</span>
                      </div>
                    )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamResults;
