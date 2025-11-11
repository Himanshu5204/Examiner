import { Bell } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Welcome Back 👋</h1>
      <div className="flex items-center gap-4">
        {/* <Bell className="w-6 h-6 text-gray-600" /> */}
        {/* <img src="https://ui-avatars.com/api/?name=Jane+Cooper" className="w-8 h-8 rounded-full" alt="avatar" /> */}
        <div className="text-sm">Admin</div>
      </div>
    </header>
  );
};
export default Topbar;
