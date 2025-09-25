import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
// src/pages/Teacher/Topbar.jsx

const Topbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const handleProfileClick = () => {
    // If you want to pass user data to profile page:
    navigate("/profile", { state: { user } });
    // Or simply: navigate("/teacher/profile");
  };

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, {user.name.toUpperCase()}</h2>
      <div className="flex items-center gap-4">
        {/* <span className="text-gray-500">Notifications</span> */}
        <div onClick={handleProfileClick}
          className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
          {user.name[0].toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
