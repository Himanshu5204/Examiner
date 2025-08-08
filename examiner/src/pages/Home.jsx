import React from 'react';
import { useAuth } from './Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Profile from './Profile';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const { role } = user;
      if (role === 'admin') {
        navigate('/AdminDashboard', { state: { message: 'Welcome Admin!' } });
      } else if (role === 'teacher') {
        navigate('/TeacherDashboard', { state: { message: 'Welcome Teacher!' } });
      } else {
        navigate('/StudentDashboard', { state: { message: 'Welcome Student!' } });
      }
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering if not logged in

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mt-4">
        {message && <div className='alert alert-success'>{message}</div>}
        <h2>Welcome to Home Page</h2>

      </div>
    </>
  );
};

export default Home;