// src/pages/Teacher/UpcomingExams.jsx
const UpcomingExams = () => {
  const exams = [
    { subject: 'Math', date: '2025-08-05' },
    { subject: 'Science', date: '2025-08-12' },
    { subject: 'English', date: '2025-08-18' },
  ];

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
