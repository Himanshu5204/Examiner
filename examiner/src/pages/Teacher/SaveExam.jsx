import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const SaveExam = () => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [file, setFile] = useState(null);
    const [count, setCount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [generated, setGenerated] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();


    // console.log(user);
    const teacherInfo = {
        teacher_id: user.teacher_id,
        course_id: user.course_id,
        dept_code: user.dept_code,
    };

    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        now.setSeconds(0, 0);
        return now.toISOString().slice(0, 16);
    };
    // 🔹 Step 1: Upload File to Backend
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file!");

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/ai/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("File upload failed");
            const data = await res.json();
            setUploaded(true);
            console.log("File uploaded:", data);
            alert("✅ File uploaded successfully!");
        } catch (err) {
            console.error(err);
            alert("Error uploading file!");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Step 2: Generate Questions using Backend
    const handleGenerate = async () => {
        if (!count || count <= 0) return alert("Please enter valid number of questions!");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count }),
            });

            const data = await res.json();
            setGenerated(true);
            console.log("Generated questions:", data);
            setQuestions(data.mcqs || []);
            alert("✅ MCQs generated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error generating questions!");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Step 3: Save Exam (with generated questions)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!questions.length) return alert("Please generate questions first!");
        // if (!uploaded || !generated) return alert("Either pdf not uploaded or AI not respond");

        if (new Date(endTime) <= new Date(startTime)) {
            alert("End time must be after start time!");
            return;
        }

        const payload = {
            ...teacherInfo,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            questions,
        };

        try {
            const res = await fetch("http://localhost:8000/api/teacher/exam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Saved exam:", data);
            alert("✅ Exam saved successfully!");
            navigate("/TeacherDashboard");
        } catch (error) {
            console.error(error);
            alert("Error saving exam!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow mt-6">
            <h2 className="text-2xl font-semibold mb-4">AI Exam Creator</h2>

            {/* File Upload */}
            <form onSubmit={handleFileUpload} className="space-y-4 mb-6">
                <div>
                    <label className="block font-medium mb-1">Upload Syllabus / Notes (PDF)</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    {loading ? "Uploading..." : "Upload PDF"}
                </button>
            </form>

            {/* Generate Questions */}
            <div className="space-y-4 mb-6">
                <label className="block font-medium">Number of Questions</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    {loading ? "Generating..." : "Generate MCQs"}
                </button>
            </div>

            {/* Display Questions */}
            {questions.length > 0 && (
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Generated Questions</h3>
                    <ul className="list-decimal pl-5 space-y-2">
                        {questions.map((q, i) => (
                            <li key={i}>
                                <p className="font-semibold">{q.questionText}</p>
                                <ul className="list-disc pl-5">
                                    {q.options.map((opt, idx) => (
                                        <li key={idx}>{opt}</li>
                                    ))}
                                </ul>
                                <p className="text-green-600">
                                    ✅ Correct Answer: {q.correctAnswer}
                                </p>
                                <p className="text-gray-500 italic">
                                    💡 {q.explanation}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Exam Time Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                    <label className="block mb-1 font-medium">Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        min={getCurrentDateTimeLocal()}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        min={startTime || getCurrentDateTimeLocal()}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!questions.length || loading || !generated || !uploaded}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                >
                    Save Exam
                </button>
            </form>
        </div>
    );
};

export default SaveExam;
