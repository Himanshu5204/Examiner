import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";

// src/pages/Teacher/MyStudents.jsx
const MyExams = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [exam, setExam] = useState(location.state?.exams || null);

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
    setExam(data);
  }

  useEffect(() => {
    if (!exam) {
      getExams();
    }
  }, []);

  if (!exam) {
    return <>
      <div>No Exam Found</div>
    </>;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Exams</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-center text-gray-500 border-b">
            <th>Name</th>
            <th>Date</th>
            <th>Id</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {
            exam.map((exam, idx) => (

              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 text-center">{exam.Name} </td>
                <td className="py-2 text-center">{exam.Date}</td>
                <td className="py-2 text-center">{exam.ExamId}</td>
                <td
                  className={`py-2 text-center font-semibold
                    ${exam.Status === "Past" ? "text-red-500" : ""}
                    ${exam.Status === "Upcoming" ? "text-blue-500" : ""}
                    ${exam.Status === "Running" ? "text-green-500" : ""}
                  `}
                >
                  {
                    exam.Status
                  }
                </td>
              </tr>

            ))}

        </tbody>
      </table>

    </div>
  );
};

export default MyExams;
