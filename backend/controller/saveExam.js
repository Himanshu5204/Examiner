const getSchema = require('../utils/getSchema');

const generateExamId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const saveExam = async (req, res) => {
    let { teacher_id, course_id, dept_code, startTime, endTime, questions } = req.body;
    try {
        const course = getSchema['course'];
        const isValid = await course.findOne({ teacher_id, course_id, dept_code });
        console.log(isValid, course);

        if (isValid === null) {
            res.status(404).json({ message: "teacher should be exist in course and course should be avaliable under dept" });
            return;
        }

        const exam_id = generateExamId(8);
        startTime = new Date(startTime);
        endTime = new Date(endTime);
        const Exam = getSchema['exam'];
        questions = questions.map((ques, index) => {
            return { ...ques, questionId: index + 1 }
            // console.log(ques);
        })
        const exam = new Exam({
            exam_id, teacher_id, course_id, dept_code, live: false, startTime, endTime, questions
        });

        await exam.save();
        console.log(exam);
        res.status(200).json({ message: "Exam saved!", exam });
    } catch (err) {
        console.error("Error_SaveExam_function", err);
        res.status(500).json({ message: err });
    }
};

module.exports = saveExam;