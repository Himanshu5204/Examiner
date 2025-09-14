import { useEffect, useState } from "react";

// src/pages/Student/MyExams.jsx
const MyExams = () => {

  const [exams, setExams] = useState([]);

  let data = [];
  const extractDate = (dateStr) => {

  }

  //format date and check status
  const checkExamStatus = (dateStrStart, dateStrEnd) => {
    // dateStrStart = "13/09 19:40"
    // dateStrEnd = "13/09 20:10"
    const [day, monthAndTime] = dateStrStart.split("/");  //   [13 , 09 19:40]
    const [month, time] = monthAndTime.split(" "); // [09, 19:40]
    const [hours, minutes] = time.split(":"); //  [ 19, 40]

    const now = new Date();
    const year = now.getFullYear();

    const examDate = new Date(year, month - 1, day, hours, minutes);
    let status = examDate > now ? "Upcoming" : "Completed";

    const [month2, time2] = dateStrEnd.split(" ");
    const [hours2, minutes2] = time2.split(":");

    const finalDate = day + "/" + month + "  " + hours + ":" + minutes + " to " + hours2 + ":" + minutes2;

    return [status, finalDate];
  };

  const fetchRes = async () => {
    const res = await fetch('http://localhost:8000/api/student/exam', {
      method: 'GET',
    });

    const serverData = await res.json();

    // setMessage(data.message);
    console.log('dataa', data);

    for (let i = 0; i < serverData.length; i++) {
      const [status, date] = checkExamStatus(serverData[i].Start, serverData[i].End);
      data.push({
        Status: status,
        Course: serverData[i].Course,
        Date: date,
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
      <ul className="space-y-3">
        {exams.map((exam, idx) => (
          <li key={idx} className="flex justify-between border-b pb-2">
            <div>
              <span className="font-medium">{exam.Course}</span>
              <p className="text-sm text-gray-500">{exam.Date}</p>
              {/* <p className="text-sm text-gray-500">{exam.Teacher}</p> */}
            </div>
            <span className={`text-sm px-4 py-2 rounded-full ${exam.Status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {exam.Status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyExams;
