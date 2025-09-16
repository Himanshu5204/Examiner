import { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import QuestionCard from './QuestionCard';
import SubmitConfirmation from './SubmitConfirmation';
import { useParams, useLocation } from 'react-router-dom';

const ExamPage = () => {
  const { examId } = useParams();
  const location = useLocation();
  const examDetails = location.state?.exam;
  console.log(examDetails, "<<<<");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);

  const getQuestionList = async () => {
    const res = await fetch(`http://localhost:8000/api/student/exam/${examId}`);
    const serverData = await res.json();
    setQuestions(serverData); // use Questions array from backend
  };

  useEffect(() => {
    getQuestionList();
  }, [examId]);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = () => {
    setShowSubmit(true);
  };

  const handleFinalSubmit = () => {
    console.log('Submitted answers:', answers);
    alert('Exam submitted successfully!');
    // send answers to backend here
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Exam</h2>

        {examDetails && (
          <CountdownTimer
            durationInMinutes={examDetails.duration}
            onTimeout={handleSubmit}
          />
        )}
      </div>

      {/* Question Card */}
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
        selectedOption={answers[currentIndex]}
        onSelectOption={handleSelect}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Submit Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Exam
        </button>
      </div>

      {showSubmit && (
        <SubmitConfirmation
          answers={answers}
          total={questions.length}
          onConfirm={handleFinalSubmit}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  );
};

export default ExamPage;
