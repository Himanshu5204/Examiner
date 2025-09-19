import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../Context/AuthContext';
// src/pages/Student/MyExams.jsx
const MyExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const { user } = useAuth();

  let data = [];

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

  //format date and check status
  // const checkExamStatus = (dateStrStart, dateStrEnd) => {
  //   // dateStrStart = "13/09 19:40"
  //   // dateStrEnd = "13/09 21:10"

  //   // --- Parse Start ---
  //   const [dayStart, monthAndTimeStart] = dateStrStart.split("/");
  //   const [monthStart, timeStart] = monthAndTimeStart.split(" ");
  //   const [hoursStart, minutesStart] = timeStart.split(":");

  //   // --- Parse End ---
  //   const [dayEnd, monthAndTimeEnd] = dateStrEnd.split("/");
  //   const [monthEnd, timeEnd] = monthAndTimeEnd.split(" ");
  //   const [hoursEnd, minutesEnd] = timeEnd.split(":");

  //   const year = new Date().getFullYear();

  //   const start = new Date(year, monthStart - 1, dayStart, hoursStart, minutesStart);
  //   const end = new Date(year, monthEnd - 1, dayEnd, hoursEnd, minutesEnd);

  //   const now = new Date();

  //   let status = "";
  //   if (now < start) {
  //     status = "Upcoming";
  //   } else if (now > end) {
  //     status = "Completed";
  //   } else {
  //     status = "Running"; // 👈 when current time is between start & end
  //   }

  //   const finalDate = `${dayStart}/${monthStart} ${hoursStart}:${minutesStart} to ${hoursEnd}:${minutesEnd}`;
  //   return [status, finalDate];
  // };

  const fetchRes = async () => {
    const res = await fetch(`http://localhost:8000/api/student/user-exam/${user.student_id}`, {
      method: 'GET',
    });

    const serverData = await res.json();

    // setMessage(data.message);
    console.log('dataa', serverData);

    for (let i = 0; i < serverData.length; i++) {
      const [status, date] = checkExamStatus(serverData[i].Start, serverData[i].End);
      data.push({
        Status: status,
        Course: serverData[i].Course,
        Date: date,
        Id: serverData[i].Id,
        Submitted: serverData[i].Submitted
      })
      // console.log(data[i].Id);
    }

    setExams(data);
    console.log(data);
  }

  useEffect(() => {
    fetchRes();
  }, [])

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">My Exams</h3>
      <div className="h-[200px] overflow-y-auto scrollbar-none">
        <ul className="space-y-3">
          {exams.map((exam, idx) => (
            <li key={idx} className="flex justify-between border-b pb-2">
              <div>
                <span className="font-medium">{exam.Course}</span>
                <p className="text-sm text-gray-500">{exam.Date}</p>
                {/* <p className="text-sm text-gray-500">{exam.Teacher}</p> */}
              </div>

              {
                exam.Submitted === true
                  ? (
                    <span className={`text-sm px-4 py-2 rounded-full bg-yellow-100 text-green-600'}`}>
                      Submitted
                    </span>
                  )
                  : (
                    exam.Status === 'Running'
                      ? (
                        <div className="flex justify-center">

                          <button
                            className="btn btn-primary btn-sm mr-4"
                            onClick={() => navigate(`/exam/${exam.Id}/instructions`)}
                          >
                            Start Exam
                          </button>
                        </div>
                      )
                      : (
                        <span className={`text-sm px-4 py-2 rounded-full ${exam.Status !== 'Upcoming' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {exam.Status}
                        </span>
                      )
                  )
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyExams;
