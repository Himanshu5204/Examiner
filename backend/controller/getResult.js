// const StudentList = require('../models/studentList');
const getSchema = require('../utils/getSchema');
const Student = getSchema['student'];
const StudentList = getSchema['studentList'];
const Exam = getSchema['exam'];

const formatDateTime = (date) => {
    const d = new Date(date);
    const year = String(d.getFullYear());
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}`;
};

const getResult = async (studentId, examId) => {
    // const studentDetails = await StudentList.findOne({ student_id: studentId }, { _id: 0 });
    // console.log(studentDetails);

    const exams = await Exam.findOne({ exam_id: examId });
    const questionList = exams.questions;
    const dateOfExam = formatDateTime(exams.startTime)
    const student = await Student.findOne({ student_id: studentId });
    let studentExam = student.exams.find(ex => ex.exam_id === examId);

    const score = studentExam.score;

    studentExam = studentExam.exam_answers

    const n = questionList.length;
    const studentAnswer = new Array(n + 1);
    studentExam.forEach(question => {
        let questionNo = parseInt(question.question_id);
        studentAnswer[questionNo] = question.selected_answer
    });

    const result = questionList.map((ques) => {
        const questionNo = parseInt(ques.questionId);
        // console.log(question, studentAnswer[questionNo])
        return {
            questionNo: questionNo,
            question: ques.questionText,
            options: ques.options,
            selectedAnswer: studentAnswer[questionNo],
            correctAnswer: ques.correctAnswer,
        }
    })

    return { result: result, score: score };
}

module.exports = getResult;