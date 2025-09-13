// src/pages/Teacher/UploadStudents.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadStudents = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an Excel file first!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("xlsx", file); // key must match backend

      const res = await axios.post(
        "http://localhost:8000/api/teacher/studentList",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(res.data.message || "Students uploaded successfully!");
      setFile(null); // reset file after success
    } catch (err) {
      setMessage(
        "Upload failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Upload Students
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Choose Excel File</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg cursor-pointer focus:ring focus:ring-blue-300"
              required
            />
          </label>

          {file && (
            <div className="text-sm text-green-600">
              Selected File: <strong>{file.name}</strong>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-lg shadow-md transition`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-gray-500 text-sm text-center">
          Only .xlsx, .xls, or .csv files are supported.
        </p>
      </div>
    </div>
  );
};

export default UploadStudents;
