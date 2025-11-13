const getSchema = require('../../utils/getSchema');
// const Student = getSchema['student'];
const StudentList = getSchema['studentList'];

const getStudentStatus = async (req, res) => {
    try {
        const { crs, dept } = req.body;
        const students = await StudentList.find({ course_id: crs, dept_code: dept }, { student_id: 1, email: 1, course_id: 1, loggedin: 1, _id: 0 });
        res.status(200).json(students);
    } catch (error) {
        console.error("ERROR_studentStatus: getStudentStatus()");
        res.status(500).json({ message: "Internal server Erorr" });
    }
}

module.exports = getStudentStatus;