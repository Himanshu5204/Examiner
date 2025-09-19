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

const getResults = async (studentId) => {
    const studentDetails = await StudentList.findOne({ student_id: studentId }, { _id: 0 });
    // console.log(studentDetails);

    const exams = await Exam.find({});

    const student = await Student.findOne({ student_id: studentId });
    const studentExams = student.exams;

    console.log(exams, studentExams);

    const result = exams.map((val, ind) => {
        const studentExam = studentExams.find((ex) => ex.exam_id === val.exam_id);

        return {
            Name: val.course_id,
            ExamDate: formatDateTime(val.startTime),
            Score: studentExam ? studentExam.score : "Absent",
            Total: val.questions.length
        }
    })

    return result;
}

module.exports = getResults;