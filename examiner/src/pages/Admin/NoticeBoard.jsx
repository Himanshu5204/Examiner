const NoticeBoard = () => {
  const notices = [
    { title: 'School annual sports day celebration 2023', date: '20 July, 2023', views: '20k' },
    { title: 'Annual Function celebration 2023-24', date: '05 July, 2023', views: '15k' },
    { title: 'Mid term examination routine published', date: '15 June, 2023', views: '22k' },
    { title: 'Inter school annual painting competition', date: '18 May, 2023', views: '18k' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Notice Board</h3>
      <ul className="space-y-3">
        {notices.map((notice, idx) => (
          <li key={idx} className="border-b pb-2">
            <strong>{notice.title}</strong><br />
            <span className="text-xs text-gray-500">{notice.date} • {notice.views}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default NoticeBoard;
