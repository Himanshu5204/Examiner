const QuestionCard = ({ question, index, selectedOption, onSelectOption }) => {
  return (
    <div className="bg-white shadow p-6 rounded-2xl mb-4">
      <h4 className="text-md font-semibold mb-2">
        Q{index + 1}. {question.questionText}
      </h4>
      <div className="grid gap-2">
        {question.options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              name={`q${index}`}
              value={opt}
              checked={selectedOption === opt}
              onChange={() => onSelectOption(opt)}
              className="accent-blue-600"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
