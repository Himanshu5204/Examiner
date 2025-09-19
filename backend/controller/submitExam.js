const getSchema = require('../utils/getSchema');
const Student = getSchema['student'];
const Exam = getSchema['exam'];

const submitExam = async (student_id, exam_id, data) => {

    const student = await Student.findOne({ student_id });
    if (!student) {
        throw new Error("Student not found");
    }

    // check if exam is already submitted
    const alreadySubmitted = student.exams.some(e => e.exam_id === exam_id);
    if (alreadySubmitted) {
        throw new Error("Exam already submitted");
    }

    const exam = await Exam.findOne({ exam_id }, { questions: 1, _id: 0 });
    if (!exam) {
        throw new Error("Exam not found");
    }

    const questions = exam.questions.map((val, ind) => {
        return {
            questionId: parseInt(val.questionId),
            correctAnswer: val.correctAnswer
        }
    });

    const userAnswer = data.map((val, ind) => {
        return {
            questionId: val.question_id,
            selectedAnswer: val.selected_answer
        }
    });

    const n = questions.length;
    const answers = new Array(n);

    for (let i = 0; i < n; i++) {
        const ID = questions[i].questionId;
        answers[ID] = questions[i].correctAnswer;
    }

    let result = [];
    let score = 0;
    for (let i = 0; i < n; i++) {
        const ID = userAnswer[i].questionId;
        if (userAnswer[i].selectedAnswer == answers[parseInt(ID)]) {
            score++;
        }
        console.log(ID, answers[parseInt(ID)], userAnswer[i].selectedAnswer, "\n");
        result.push({
            question_id: ID,
            correct_answer: answers[parseInt(ID)],
            selected_answer: userAnswer[i].selectedAnswer
        });
    }

    console.log("your score is:" + score);
    result = {
        exam_id,
        exam_answers: result
    }

    console.log(result);
    student.exams.push(result);
    await student.save();

    console.log(student, "<<");
}

module.exports = submitExam;