// src/pages/Student/StudentDashboard.jsx
import Sidebar from './Student/Sidebar';
import Topbar from './Student/Topbar';
import MyExams from './Student/MyExams';
import ExamResults from './Student/ExamResults';
import NoticeBoard from './Shared/NoticeBoard';
import EventCalendar from './Shared/EventCalendar';

const StudentDashboard = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <MyExams />
          <ExamResults />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <NoticeBoard />
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
