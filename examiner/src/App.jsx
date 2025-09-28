import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './pages/Navbar';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UploadTeachers from "./pages/Admin/UploadTeachers";
import TeacherDashboard from './pages/TeacherDashboard';
import UploadStudents from "./pages/Teacher/UploadStudents";
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './pages/Context/AuthContext';
import ExamPage from './pages/StudentExam/ExamPage';
import Spinner from './pages/Shared/Spinner';
import ExamInstructions from './pages/StudentExam/ExamInstructions';
import ExamResultsAll from './pages/Student/ExamResultsAll';
import StudentList from './pages/Teacher/StudentList';
import SaveExam from './pages/Teacher/SaveExam';
import MyExams from './pages/Teacher/MyExams';
import Analytics from './pages/Teacher/Analytics';


const isAuthenticated = () => !!localStorage.getItem('token');

// to checks wheather users has correct role to access route false then send to login
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to='/login' replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navbar on login and signup pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      {children}
    </>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path='/profile' element={<Profile />} />

          <Route
            path='/AdminDashboard'
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='/TeacherDashboard'
            element={
              <ProtectedRoute roles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='/StudentDashboard'
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* students */}
          <Route path='/exam/:examId' element={<ExamPage />} />
          <Route path="/admin/upload-teachers" element={<UploadTeachers />} />
          <Route path="/exam/:examId/instructions" element={<ExamInstructions />} />
          <Route path="/results" element={<ExamResultsAll />} />

          {/* teacher */}
          <Route path="/teacher/UploadStudents" element={<UploadStudents />} />
          <Route path="/teacher/students" element={<StudentList />} />
          <Route path="/teacher/create-exam" element={<SaveExam />} />
          <Route path="/teacher/exams" element={<MyExams />} />
          <Route path="/teacher/analytics" element={<Analytics />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
