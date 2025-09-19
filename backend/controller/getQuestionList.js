const getSchema = require('../utils/getSchema');
const exam = getSchema['exam'];
const course = getSchema['course'];
const teacher = getSchema['teacher'];

const getQuestionList = async (examId) => {
    const examData = await exam.findOne({ exam_id: examId }, { questions: 1, _id: 0, teacher_id: 1, course_id: 1, dept_code: 1 });
    // console.log(examData.questions);
    let ques = examData.questions;
    const formattedQues = ques.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
    }));
    formattedQues.sort(() => 0.5 - Math.random());
    console.log(formattedQues);
    return formattedQues;
};

module.exports = getQuestionList;