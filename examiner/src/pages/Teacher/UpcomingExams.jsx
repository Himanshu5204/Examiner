import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// src/pages/Teacher/UpcomingExams.jsx
const UpcomingExams = () => {
  const navigate = useNavigate();
  // const [exams, setExams] = useState([]);
  const { user } = useAuth();
  const exams = [
    { subject: 'Math', date: '2025-08-05' },
    { subject: 'Science', date: '2025-08-12' },
    { subject: 'English', date: '2025-08-18' },
  ];

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
      status = "Absent";
    } else {
      status = "Running";
    }

    const finalDate = `${formatIST(startTime, true)} To ${formatIST(endTime, false)}`;
    return [status, finalDate];
  };

  const getExams = async () => {
    const res = await fetch(`http://localhost:8000/api/teacher/exams/${user.teacher_id}`, {
      method: 'GET',
    });

    const serverData = await res.json();

    // setMessage(data.message);
    // console.log('dataa', serverData);
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
  }

  useEffect(() => {
    getExams();
  }, []);
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
      <ul className="space-y-3">
        {exams.map((exam, idx) => (
          <li key={idx} className="flex justify-between border-b pb-2">
            <span>{exam.subject}</span>
            <span className="text-gray-500 text-sm">{exam.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingExams;
