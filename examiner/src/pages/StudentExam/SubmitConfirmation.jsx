// src/pages/StudentExam/SubmitConfirmation.jsx
const SubmitConfirmation = ({ answers, total, onConfirm, onCancel }) => {
  // const answeredCount = Object.keys(answers).length - 1;
  let answeredCount = 0;
  console.log(answers)
  for (let i = 1; i <= total; i++) {
    if (answers[i] !== '') answeredCount++;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Confirm Submission</h3>
        <p className="text-sm mb-4">
          You have answered {answeredCount} out of {total} questions. Are you sure you want to submit?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmation;
