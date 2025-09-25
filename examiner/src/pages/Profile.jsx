// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [Id, setId] = useState();
  const [role, setRole] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.teacher_id !== undefined) {
      setId(user.teacher_id);
      setRole("Teacher")
    } else if (user.student_id !== undefined) {
      setId(user.student_id);
      setRole("Student")
    } else if (user.admin_id !== undefined) {
      setId(user.admin_id);
      setRole("Admin")
    } else {
      setId("-");
      setRole("Unknown")
    }
  }, [])
  const handleLogout = () => {
    logout();          // clear auth/session
    navigate("/login"); // redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-500">
            {user.name[0].toUpperCase()}
          </div>
          <h2 className="text-white text-2xl font-semibold mt-4">{user.name}</h2>
          <p className="text-blue-100 mt-1">{user.email}</p>
        </div>

        {/* Info Sections */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Role:</span>
            <span className="font-semibold capitalize">
              {role}
              &nbsp;
              <span className="text-gray-500">({Id})</span>
            </span>

          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Course:</span>
            <span className="font-semibold">{user.course_id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Department:</span>
            <span className="font-semibold">{user.dept_code}</span>
          </div>

          {/* Change Password */}
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>
          {showChangePassword && (
            <form className="mt-3 space-y-3">
              <input
                type="password"
                placeholder="New Password"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded-lg p-2"
              />
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
              >
                Update Password
              </button>
            </form>
          )}

          {/* Logout */}
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;