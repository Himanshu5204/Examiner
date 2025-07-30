// src/pages/Teacher/CreateExamShortcut.jsx
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateExamShortcut = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/teacher/create-exam');
  };

  return (
    <div
      onClick={handleClick}
      className="bg-blue-100 hover:bg-blue-200 cursor-pointer p-6 rounded-2xl shadow flex items-center gap-4 transition-all duration-200"
    >
      <Plus className="text-blue-600" />
      <div>
        <h3 className="text-lg font-semibold text-blue-800">Create New Exam</h3>
        <p className="text-sm text-blue-600">Quick access to create exams</p>
      </div>
    </div>
  );
};

export default CreateExamShortcut;
