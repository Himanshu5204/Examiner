// src/pages/Student/MyExams.jsx
const MyExams = () => {
  const exams = [
    { subject: 'Math', date: '2025-08-05', status: 'Pending' },
    { subject: 'English', date: '2025-08-10', status: 'Completed' },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">My Exams</h3>
      <ul className="space-y-3">
        {exams.map((exam, idx) => (
          <li key={idx} className="flex justify-between border-b pb-2">
            <div>
              <span className="font-medium">{exam.subject}</span>
              <p className="text-sm text-gray-500">{exam.date}</p>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${exam.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {exam.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyExams;
