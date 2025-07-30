// src/pages/Student/ExamResults.jsx
const ExamResults = () => {
  const results = [
    { subject: 'Math', score: 88 },
    { subject: 'English', score: 92 },
    { subject: 'Science', score: 76 },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Exam Results</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2">{r.subject}</td>
              <td>{r.score} / 100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamResults;
