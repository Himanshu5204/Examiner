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

const getAllResults = async (studentId) => {
    // const studentDetails = await StudentList.findOne({ student_id: studentId }, { _id: 0 });
    // console.log(studentDetails);

    const exams = await Exam.find({}).sort({ startTime: -1 });

    const student = await Student.findOne({ student_id: studentId });
    const studentExams = student.exams;

    console.log(exams, studentExams);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const result = exams

        .filter(val => {
            const examDate = new Date(val.startTime);
            if (examDate < now) return true;
            const studentExam = studentExams.find(ex => ex.exam_id === val.exam_id);
            if (examDate.toDateString() === now.toDateString() && studentExam) return true;
            return false;
        })

        .map((val, ind) => {

            const studentExam = studentExams.find((ex) => ex.exam_id === val.exam_id);
            // if(val.startTime)
            return {
                Id: val.exam_id,
                Name: val.course_id,
                ExamDate: formatDateTime(val.startTime),
                Score: studentExam ? studentExam.score : "Absent",
                Total: val.questions.length
            }
        })

    return result;
}

module.exports = getAllResults;