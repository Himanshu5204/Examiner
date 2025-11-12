const getSchema = require("../../utils/getSchema");
const { getStudentsByExamId } = require("../Analytics");
const Exam = getSchema['exam'];

const getDeptWiseResult = async () => {
    const exams = await Exam.find({}, { exam_id: 1, course_id: 1, dept_code: 1, teacher_id: 1, _id: 0 }).sort({ startTime: -1 });

    const res = [];
    console.log(exams);

    for (const exam of exams) {
        await getStudentsByExamId(exam.course_id, exam.dept_code, exam.exam_id).then((data) => {
            // res.push(data);
            const response = Object.fromEntries(data)
            res.push({
                ...response,
                course: exam.course_id,
                dept: exam.dept_code,
                exam_id: exam.exam_id,
                teacher_id: exam.teacher_id
            });
        })
    }

    console.log(">", res, "<");

    return res;
}

module.exports = getDeptWiseResult;