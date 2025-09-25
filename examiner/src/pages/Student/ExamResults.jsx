import { useEffect, useState, } from 'react';
import { useAuth } from './../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// src/pages/Student/ExamResults.jsx
const ExamResults = () => {
  const { user } = useAuth();
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const getResult = async () => {
    const res = await fetch(`http://localhost:8000/api/student/result/${user.student_id}`);
    const serverData = await res.json();
    console.log(serverData);
    setResult(serverData);
  }

  const downloadResult = async (examId) => {

    console.log(user.student_id, examId);

    const data = {
      "studentId": user.student_id,
      "examId": examId
    }

    const res = await fetch('http://localhost:8000/api/student/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      console.error("Failed to download file");
      return;
    }

    // Get filename from headers
    const disposition = res.headers.get("content-disposition");
    let filename = "result.pdf"; // fallback
    console.log(disposition);
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }
    // Convert response to blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Create temporary link
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // use backend filename
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Cleanup
    window.URL.revokeObjectURL(url);
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
          {result.slice(0, 3).map((r, idx) => (

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
                      <div className="text-center">
                        <span>-</span>
                      </div>
                    )
                }
              </td>
            </tr>
          ))}


        </tbody>
      </table>
      {result.length > 3 && (
        <div className="mt-4 text-center">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/results", { state: { result } })}
          >
            More
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
