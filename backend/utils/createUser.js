//LOAD models
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const TeacherList = require('../models/teacherList');
// const Course = require('../models/course');
// const Dept = require('../models/dept');

//creating student
const bcrypt = require('bcrypt');

const createStudent = async (data) => {
    console.log("Student");
    const { student_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newStudent = new Student({ student_id, name, email, password: hashedPassword, contact, role: 'student' });
    // await newStudent.save();
    return newStudent;
}

//creating admin
const createAdmin = async (data) => {
    console.log("Admin");
    const { admin_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newAdmin = new Admin({ admin_id, name, email, password: hashedPassword, contact, role: 'admin' });
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