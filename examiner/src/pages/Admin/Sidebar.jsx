import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {

  //logout fun acessed from AuthContext + navigate on login so useNavigate
  const { logout } = useAuth();
  const navigate = useNavigate();

  //function so onClick user can logout
  const handleLogout = () => {
    logout(); //fun called
    navigate('/login');
  };

  const links = ['Dashboard', 'Students', 'Teachers', 'Exam', 'Events', 'Analytics', 'Help center', 'Notice', 'Settings', 'Logout'];
  return (
    <aside className="bg-white p-4 border-r min-h-screen">
      <h2 className="text-xl font-bold mb-4">🎓 Examee</h2>
      <nav className="space-y-4">
        {links.map((item) => (
          <button onClick={handleLogout} key={item} className="w-full text-left p-2 rounded hover:bg-blue-100">{item}</button>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;
