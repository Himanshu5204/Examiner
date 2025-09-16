const getSchema = require('../utils/getSchema');
const exam = getSchema['exam'];
const course = getSchema['course'];
const teacher = getSchema['teacher'];

const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
};

const getExamDeatils = async (exam_id) => {
    const exams = await exam.findOne({ exam_id }, { course_id: 1, teacher_id: 1, live: 1, startTime: 1, endTime: 1, _id: 0 });

    // console.log(exams);
    const tId = exams.teacher_id, cId = exams.course_id;
    // console.log(tId, cId);
    const teacherData = await teacher.findOne({ teacher_id: tId }, { name: 1, _id: 0 });
    // console.log(teacherName, courseName);

    const duration = (new Date(exams.endTime) - new Date(exams.startTime)) / (1000 * 60);

    const formattedExam = {
        teacherName: teacherData.name,
        courseName: cId,
        start: formatDateTime(exams.startTime),
        end: formatDateTime(exams.endTime),
        duration
    }

    // console.log(formattedExams);
    return formattedExam;
};

module.exports = getExamDeatils;