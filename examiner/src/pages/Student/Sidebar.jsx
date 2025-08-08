// src/pages/Student/Sidebar.jsx
import { BookOpenCheck, FileText, CalendarDays, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-white shadow-md h-screen p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Student Panel</h1>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 ${isActive ? 'text-green-600 font-semibold' : 'hover:text-green-500'}`
          }
        >
          <BookOpenCheck /> Dashboard
        </NavLink>
        <NavLink
          to="/student/results"
          className={({ isActive }) =>
            `flex items-center gap-2 ${isActive ? 'text-green-600 font-semibold' : 'hover:text-green-500'}`
          }
        >
          <FileText /> Results
        </NavLink>
        <NavLink
          to="/login"
          className="text-red-500 flex items-center gap-2 mt-auto"
        >
          <LogOut /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
