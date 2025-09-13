// src/pages/Teacher/UploadStudentsShortcut.jsx
import { FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadStudents from "./UploadStudents";

const UploadStudentsShortcut = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/teacher/UploadStudents");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-green-100 hover:bg-green-200 cursor-pointer p-6 rounded-2xl shadow flex items-center gap-4 transition-all duration-200"
    >
      <FileUp className="text-green-600" />
      <div>
        <h3 className="text-lg font-semibold text-green-800">Upload Students</h3>
        <p className="text-sm text-green-600">Quick access to upload Excel files</p>
      </div>
    </div>
  );
};

export default UploadStudentsShortcut;
