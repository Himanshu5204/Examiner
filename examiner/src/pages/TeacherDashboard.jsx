import Sidebar from './Teacher/Sidebar';
import Topbar from './Teacher/Topbar';
import MyStudents from './Teacher/MyStudents';
import StudentPerformanceChart from './Teacher/StudentPerformanceChart';
import UpcomingExams from './Teacher/UpcomingExams';
import CreateExamShortcut from './Teacher/CreateExamShortcut';
import NoticeBoard from './Shared/NoticeBoard';
import EventCalendar from './Shared/EventCalendar';
import UploadStudentsShortcut from "./Teacher/UploadStudentsShortcut";
//import UploadStudents from "./Teacher/UploadStudents";

const TeacherDashboard = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <CreateExamShortcut />
          <UploadStudentsShortcut />
          {/* <UploadStudents /> */}
          {/* <NoticeBoard /> */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <UpcomingExams />
          <MyStudents />
          <StudentPerformanceChart />
        </div>
        {/* <div className="p-4">
          <EventCalendar />
        </div> */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
