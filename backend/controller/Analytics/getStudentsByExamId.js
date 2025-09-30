const getSchema = require("../../utils/getSchema")
const Student = getSchema['student'];
const StudentList = getSchema['studentList'];
const Exam = getSchema['exam'];

const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const year = String(d.getFullYear()).padStart(4, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getStudentsByExamId = async (course_id, dept_code, exam_id) => {
    const now = new Date();
    let exams;
    // console.log(exam_id);
    if (!exam_id) {
        exams = await Exam.find({ course_id, endTime: { $lt: now } }, { _id: 0, exam_id: 1, startTime: 1, endTime: 1, questions: 1 }).sort({ startTime: -1 });
    } else {
        exams = await Exam.find({ exam_id, endTime: { $lt: now } }, { _id: 0, exam_id: 1, startTime: 1, endTime: 1, questions: 1 }).sort({ startTime: -1 })
    }
    // console.log(exams, "<Exams>");
    const examStudentMapping = new Map();

    const students = await StudentList.find({ course_id, dept_code }, { student_id: 1, _id: 0 });
    const len = students.length; //total student under {course_id, dept_code}

    //set exam_id as key
    exams.forEach(ex =>
        examStudentMapping.set(
            ex.exam_id,
            {
                attended: [],
                not_attended: [],
                total: len,
                attended_total: 0,
                not_attended_total: 0,
                date: formatDateTime(ex.startTime),
                totalMarks: ex.questions.length
            }
        )
    );

    // console.log(len);

    //travese each students for following course_id, dept_code in the studentList
    for (const stud of students) {

        //extract details of student from Student table
        const student = await Student.findOne(
            { student_id: stud.student_id },
            { _id: 0, name: 1, email: 1, "exams.exam_id": 1, "exams.score": 1 }
        );

        //exam given by student
        const studentAttendedExams = student.exams


        // for each exam taken by {course_id,dept_code} find student given or not
        examStudentMapping.forEach((_, ex_id) => {

            const exists = studentAttendedExams.find(e => e.exam_id === ex_id);

            //student given exam ex_id
            if (exists) {

                examStudentMapping.get(ex_id).attended.push({
                    name: student.name,
                    email: student.email,
                    score: exists.score
                });
                examStudentMapping.get(ex_id).attended_total++;

            }
            //student not given exam ex_id
            else {

                examStudentMapping.get(ex_id).not_attended.push({
                    name: student.name,
                    email: student.email
                });
                examStudentMapping.get(ex_id).not_attended_total++;

            }
        })

    };

    return examStudentMapping;
}

module.exports = getStudentsByExamId;