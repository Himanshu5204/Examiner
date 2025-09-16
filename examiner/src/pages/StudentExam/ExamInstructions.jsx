import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExamInstructions = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [durationInMinutes, setDurationInMinutes] = useState(0);

    useEffect(() => {
        const fetchExamDetails = async () => {
            const res = await fetch(`http://localhost:8000/api/student/examDetails/${examId}`);
            const data = await res.json();
            const durationInMin = data.duration;
            setDurationInMinutes(durationInMin);

            const hrs = (Math.floor(durationInMin / 60));
            const mins = (durationInMin % 60);

            let duration = "Nan";
            if (hrs <= 0) {
                duration = mins + " Minutes";
            } else {
                duration = hrs + " Hrs " + mins + " Min";
            }
            data.duration = duration;

            // data should contain exam details (Course, Instructor, Start, End)
            setExam(data);
            // console.log(dur);
        };

        fetchExamDetails();
    }, [examId]);

    if (!exam) {
        return <p className="p-6">Loading exam details...</p>;
    }

    // Calculate duration
    const start = new Date(exam.Start);
    const end = new Date(exam.End);
    const duration = Math.floor((end - start) / (1000 * 60)); // minutes

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">{exam.courseName}</h2>
            <p><strong>Instructor:</strong> {exam.teacherName}</p>
            <p><strong>Duration:</strong> {exam.duration}</p>
            <p><strong>Start:</strong> {exam.start}</p>
            <p><strong>End:</strong> {exam.end}</p>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Read all questions carefully before answering.</li>
                    <li>You can navigate between questions using Next/Previous.</li>
                    <li>Only one option can be selected per question.</li>
                    <li>Once submitted, answers cannot be changed.</li>
                </ul>
            </div>

            <div className="mt-6">
                <label className="flex items-center gap-2">
                    <input type="checkbox" id="ack" className="accent-blue-600" />
                    <span>I have read and understood the instructions.</span>
                </label>
            </div>

            <button
                onClick={() => {
                    const ack = document.getElementById("ack").checked;
                    if (!ack) {
                        alert("Please acknowledge instructions before starting.");
                        return;
                    }
                    exam.duration = durationInMinutes;
                    navigate(`/exam/${examId}`, { state: { exam } });
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Start Exam
            </button>
        </div>
    );
};

export default ExamInstructions;