// src/pages/StudentExam/ExamPage.jsx
import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import QuestionCard from './QuestionCard';
import SubmitConfirmation from './SubmitConfirmation';

const sampleQuestions = [
  {
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
  {
    text: 'Capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    answer: 'Paris',
  },
];

const ExamPage = () => {
  const [answers, setAnswers] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    setShowSubmit(true);
  };

  const handleFinalSubmit = () => {
    console.log('Submitted answers:', answers);
    alert('Exam submitted successfully!');
    // Redirect or send data to backend
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Exam</h2>
        <CountdownTimer durationInMinutes={30} onTimeout={handleSubmit} />
      </div>

      {sampleQuestions.map((q, i) => (
        <QuestionCard
          key={i}
          index={i}
          question={q}
          selectedOption={answers[i]}
          onSelectOption={handleSelect}
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Submit Exam
      </button>

      {showSubmit && (
        <SubmitConfirmation
          answers={answers}
          total={sampleQuestions.length}
          onConfirm={handleFinalSubmit}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  );
};

export default ExamPage;
