import Sidebar from './Admin/Sidebar';
import Topbar from './Admin/Topbar';
import StatsCards from './Admin/StatsCards';
import GenderPieChart from './Admin/GenderPieChart';
import AttendanceChart from './Admin/AttendanceChart';
import NoticeBoard from './Admin/NoticeBoard';
import EventCalendar from './Admin/EventCalendar';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-blue-50">
      <Sidebar />
      <main className="p-6 space-y-6">
        <Topbar />
        <StatsCards />
        <div className="grid grid-cols-2 gap-6">
          <GenderPieChart />
          {/* <AttendanceChart /> */}
        </div>

        {/* 
        <div className="grid grid-cols-2 gap-6">
          <NoticeBoard />
          <EventCalendar />
        </div> 
        */}
      </main>
    </div>
  );
};
export default AdminDashboard;
