import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SaveExam = () => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([
        {
            questionText: "What is Java?",
            options: ["Programme", "Classes", "Objects", "Data"],
            correctAnswer: "Programme",
        },
        {
            questionText: "What is Machine Learning?",
            options: ["Programme", "Random things", "Clouds", "Maths"],
            correctAnswer: "Random things",
        },
        {
            questionText: "2 + 2 = ?",
            options: ["2", "4", "6", "8"],
            correctAnswer: "4",
        },
    ]);

    const teacherInfo = {
        teacher_id: "ary12",
        course_id: "CS101",
        dept_code: "MC201",
    };

    // Helper: get current datetime in format for datetime-local input
    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        now.setSeconds(0, 0); // remove seconds & milliseconds
        return now.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        console.log(payload);

        try {
            const res = await fetch("http://localhost:8000/api/teacher/exam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            alert("Exam saved successfully!");
            console.log("Saved exam:", data);
            navigate('/TeacherDashboard');
        } catch (error) {
            console.error(error);
            alert("Error saving exam");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow mt-6">
            <h2 className="text-2xl font-semibold mb-4">Create Exam</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Start Time */}
                <div>
                    <label className="block mb-1 font-medium">Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                            // auto adjust end time if it is before start
                            if (endTime && new Date(e.target.value) >= new Date(endTime)) {
                                setEndTime("");
                            }
                        }}
                        min={getCurrentDateTimeLocal()}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                {/* End Time */}
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

                {/* Questions (static for now) */}
                <div>
                    <h3 className="font-medium mb-2">Questions</h3>
                    <ul className="list-decimal pl-5 space-y-2">
                        {questions.map((q, i) => (
                            <li key={i}>
                                <p className="font-semibold">{q.questionText}</p>
                                <ul className="list-disc pl-5">
                                    {q.options.map((opt, idx) => (
                                        <li key={idx}>{opt}</li>
                                    ))}
                                </ul>
                                <p className="text-green-600">Answer: {q.correctAnswer}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Save Exam
                </button>
            </form>
        </div>
    );
};

export default SaveExam;