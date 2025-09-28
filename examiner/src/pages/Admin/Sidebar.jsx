import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar links with actions
  const links = [
    { name: 'Dashboard', path: '/AdminDashboard' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Teachers', path: '/admin/upload-teachers' },
    { name: 'Exam', path: '/admin/exams' },
    // { name: 'Events', path: '/admin/events' },
    { name: 'Analytics', path: '/admin/analytics' },
    // { name: 'Help center', path: '/admin/help' },
    // { name: 'Notice', path: '/admin/notice' },
    // { name: 'Settings', path: '/admin/settings' },
    { name: 'Logout', action: handleLogout },
  ];

  const handleClick = (link) => {
    if (link.action) {
      link.action(); // for logout
    } else if (link.path) {
      navigate(link.path); // normal navigation
    }
  };

  return (
    <aside className="bg-white p-4 border-r min-h-screen">
      <h2 className="text-xl font-bold mb-4">🎓 Examee</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => handleClick(link)}
            className="w-full text-left p-2 rounded hover:bg-blue-100"
          >
            {link.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
