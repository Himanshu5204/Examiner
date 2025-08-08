// src/pages/Teacher/Sidebar.jsx
import { BookOpen, Users, CalendarDays, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-white shadow-md h-screen p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Teacher Panel</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/teacher/dashboard" className="hover:text-blue-500 flex items-center gap-2">
          <BookOpen /> Dashboard
        </Link>
        <Link to="/teacher/students" className="hover:text-blue-500 flex items-center gap-2">
          <Users /> My Students
        </Link>
        <Link to="/teacher/exams" className="hover:text-blue-500 flex items-center gap-2">
          <CalendarDays /> Exams
        </Link>
        <Link to="/login" className="text-red-500 flex items-center gap-2 mt-auto">
          <LogOut /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
