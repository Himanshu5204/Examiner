//LOAD models
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const TeacherList = require('../models/teacherList');
const StudentList = require('../models/studentList');
// const Course = require('../models/course');
// const Dept = require('../models/dept');

const bcrypt = require('bcrypt');

//creating student
const createStudent = async (data) => {
    console.log("Student");
    const { student_id, name, email, password, contact, gender } = data;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newStudent = new Student({ student_id, name, email, password: hashedPassword, contact });
    try {

        const validStudent = await StudentList.findOne({ student_id: student_id, email: email });

        //teacher not found on TeacherList
        if (!validStudent) {
            console.log("Not valid student");
            return { status: 204, user: null };
        }

        //teacher found but already signedin
        if (validStudent.loggedin === true) {
            console.log("Already register");
            return { status: 403, user: null };
        }

        //change state of teacher loggdin(false -> true)
        await StudentList.updateOne({ student_id: student_id }, { loggedin: true });

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        //createing new Teacher object with dept_code & course_id described in TeacherList
        const newStudent = new Student({
            student_id,
            name,
            email,
            password: hashedPassword,
            contact,
            gender,
            loggedin: true,
        });

        //succesfully created student
        return { status: 200, user: newStudent };
    } catch (error) {
        console.error("Error_Student_Signup: " + error);
        return { status: 500, user: null };
    }
}

//creating admin
const createAdmin = async (data) => {
    console.log("Admin");
    const { admin_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newAdmin = new Admin({ admin_id, name, email, password: hashedPassword, contact });
    // await newAdmin.save();

    return { status: 200, user: newAdmin };
}

//creating teacher
const createTeacher = async (data) => {
    console.log("Teacher");
    const { teacher_id, name, email, password, contact } = data;
    try {

        const validTeacher = await TeacherList.findOne({ teacher_id: teacher_id, email: email });

        //teacher not found on TeacherList
        if (!validTeacher) {
            console.log("Not valid teacher");
            return { status: 204, user: null };
        }

        //teacher found but already signedin
        if (validTeacher.loggedin === true) {
            console.log("Already register");
            return { status: 403, user: null };
        }

        //change state of teacher loggdin(false -> true)
        await TeacherList.updateOne({ teacher_id: teacher_id }, { loggedin: true });

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        //createing new Teacher object with dept_code & course_id described in TeacherList
        const newTeacher = new Teacher({
            teacher_id,
            name,
            email,
            password: hashedPassword,
            contact,
            loggedin: true,
            dept_code: validTeacher.dept_code,
            course_id: validTeacher.course_id
        });

        //succesfully created teacher
        return { status: 200, user: newTeacher };
    } catch (error) {
        console.error("Error_Teacher_Signup: " + error);
        return { status: 500, user: null };
    }
}

module.exports = {
    createStudent,
    createTeacher,
    createAdmin
}