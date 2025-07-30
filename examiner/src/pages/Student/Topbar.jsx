// src/pages/Student/Topbar.jsx
const Topbar = () => {
  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, Student</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">Notifications</span>
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
          S
        </div>
      </div>
    </div>
  );
};

export default Topbar;
