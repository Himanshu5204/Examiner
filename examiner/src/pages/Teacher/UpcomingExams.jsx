import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// src/pages/Teacher/UpcomingExams.jsx
const UpcomingExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const { user } = useAuth();

  const formatIST = (utcString, withDate = false) => {
    const date = new Date(utcString);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: withDate ? "2-digit" : undefined,
      month: withDate ? "2-digit" : undefined,
      year: withDate ? "2-digit" : undefined,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  let data = [];
  const checkExamStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    let status = "";
    if (now < start) {
      status = "Upcoming";
    } else if (now > end) {
      status = "Past";
    } else {
      status = "Running";
    }

    const finalDate = `${formatIST(startTime, true)}`;
    return [status, finalDate];
  };

  const getExams = async () => {
    const res = await fetch(`http://localhost:8000/api/teacher/exams/${user.teacher_id}`, {
      method: 'GET',
    });

    const serverData = await res.json();

    // setMessage(data.message);
    console.log('dataa', serverData);
    for (let i = 0; i < serverData.length; i++) {
      const [status, date] = checkExamStatus(serverData[i].Start, serverData[i].End);
      data.push({
        Status: status,
        Name: serverData[i].name,
        ExamId: serverData[i].examId,
        Date: date,
      })
    }
    console.log('dataa', data);
    setExams(data);
  }

  useEffect(() => {
    getExams();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Name</th>
            <th>Date</th>
            <th>Exam Id</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>

          {
            exams
              .filter(exam => exam.Status === "Upcoming" || exam.Status === "Running")
              .slice(0, 3)
              .map((exam, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2">{exam.Name}</td>
                  <td>{exam.Date}</td>
                  <td>{exam.ExamId}</td>
                  <td
                    className={
                      exam.Status === "Upcoming"
                        ? "text-blue-500 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >{exam.Status}</td>
                </tr>
              ))}

        </tbody>
      </table>

      {
        exams.length > 3 && (
          <div className="mt-4 flex justify-center">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/teacher/exams", { state: { exams } })}
            >
              More
            </button>
          </div>
        )
      }
    </div >
  );
};

export default UpcomingExams;
