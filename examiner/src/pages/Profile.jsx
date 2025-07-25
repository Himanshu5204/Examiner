import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Dummy user info, replace with real data
  const userInfo = {
    name: 'User Name',
    email: 'user@example.com',
    role: 'student'
  };

  return (
    <div>
      <h3>Profile</h3>
      <p><strong>Name:</strong> {userInfo.name}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Role:</strong> {userInfo.role}</p>
      <button className="btn btn-secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
        Change Password
      </button>
      {showChangePassword && (
        <form className="mt-3">
          <input type="password" placeholder="New Password" className="form-control mb-2" />
          <button type="submit" className="btn btn-primary">Update Password</button>
        </form>
      )}
      <button className="btn btn-danger mt-3" onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;