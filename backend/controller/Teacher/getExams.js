const getSchema = require('../../utils/getSchema');
const Exam = getSchema['exam'];

const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const year = String(d.getFullYear()).padStart(4, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}`;
};

const getExams = async (teacher_id) => {
    try {
        console.log(teacher_id)
        const exams = await Exam.find({ teacher_id }, { exam_id: 1, startTime: 1, endTime: 1, course_id: 1 });
        console.log(exams)
        const Exams = exams.map((val, ind) => {
            return {
                examId: val.exam_id,
                Start: formatDateTime(val.startTime),
                End: formatDateTime(val.endTime),
                name: val.course_id
            }
        })
        return Exams;
    } catch (error) {
        console.error("getExamsInternal Error", error)
        // res.status(500).json({ message: "Internal Error" })
        return 0;
    }
}

module.exports = getExams;