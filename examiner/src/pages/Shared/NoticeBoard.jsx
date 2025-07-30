// src/pages/Shared/NoticeBoard.jsx
const NoticeBoard = () => {
  const notices = [
    'Submit marks by 5th Aug.',
    'PTM on 10th Aug.',
    'Training session on AI tools.',
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Notice Board</h3>
      <ul className="list-disc ml-5 space-y-2 text-sm">
        {notices.map((notice, idx) => (
          <li key={idx}>{notice}</li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
