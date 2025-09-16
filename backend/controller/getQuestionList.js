const getSchema = require('../utils/getSchema');
const exam = getSchema['exam'];
const course = getSchema['course'];
const teacher = getSchema['teacher'];

const getQuestionList = async (examId) => {
    const examData = await exam.findOne({ exam_id: examId }, { questions: 1, _id: 0, teacher_id: 1, course_id: 1, dept_code: 1 });
    // console.log(examData.questions);
    let ques = examData.questions;
    const formattedQues = ques.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
    }));
    return formattedQues;
};

module.exports = getQuestionList;