import { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import QuestionCard from './QuestionCard';
import SubmitConfirmation from './SubmitConfirmation';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './../Context/AuthContext';

const ExamPage = () => {
  const { examId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const examDetails = location.state?.exam;
  const navigate = useNavigate();
  console.log(examDetails, "<<<<");
  // const ansewrr = new Array(examDetails.questionLength + 1).fill("");
  const [questions, setQuestions] = useState([]);
  // const [persistIndex, setPersistIndex] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  let [answers, setAnswers] = useState(new Array(examDetails.questionLength + 1).fill(""));
  // let [ans, setAns] = useState();
  const [showSubmit, setShowSubmit] = useState(false);

  const getQuestionList = async () => {
    const res = await fetch(`http://localhost:8000/api/student/exam/${examId}`);
    const serverData = await res.json();

    console.log("Server data: ", serverData);

    setQuestions(serverData); // use Questions array from backend
    // console.log(questions)
    // setPersistIndex(parseInt(serverData[0].questionId))

  };

  useEffect(() => {
    getQuestionList();
    let existingAnswer = JSON.parse(localStorage.getItem('answers'));
    setAnswers(existingAnswer);
  }, []);

  const handleSelect = (option) => {
    // console.log(option);
    let existingAnswer = JSON.parse(localStorage.getItem('answers'));
    // console.log("=======")
    // console.log(currentIndex, persistIndex, answers, existingAnswer);
    // setAns(option)
    // console.log("=======")
    const queId = parseInt(questions[currentIndex].questionId);
    // setPersistIndex(queId);

    console.log("localStorage(old): ", existingAnswer);

    let newAnswer = { queId: option };

    existingAnswer[queId] = option;
    setAnswers(existingAnswer);

    localStorage.setItem('answers', JSON.stringify(existingAnswer));

    console.log("localStorage(new): ", existingAnswer);

    // setAnswers([persistIndex] = option);
    // console.log(persistIndex, option);
    // handleIncrementClick(persistIndex, option);

    console.log("Answer array", answers);
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

  const handleFinalSubmit = async () => {
    // console.log('Submitted answers:', answers);
    // alert('Exam submitted successfully!');

    let answeres = JSON.parse(localStorage.getItem('answer'));
    console.log("Localstorage answer", answeres)
    let userAnswers = answers.map((val, index) => {
      return {
        question_id: `${index}`,
        selected_answer: `${val}`
      }
    })

    const data = {
      student_id: user.student_id,
      data: userAnswers
    }
    console.log(data);
    const res = await fetch(`http://localhost:8000/api/student/exam/${examId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const response = await res.json();
    if (response.message == 'Done') {
      localStorage.removeItem('examEndTime');
      localStorage.removeItem('answers');
      navigate('/StudentDashboard', { state: { message: 'Welcome Student!' } });
    } else {
      alert(response.message);
    }

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
            onTimeout={handleFinalSubmit}
          />
        )}
      </div>

      {/* Question Card */}
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
        selectedOption={answers[parseInt(questions[currentIndex].questionId)]}
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
          onConfirm={() => handleFinalSubmit()}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  );
};

export default ExamPage;
