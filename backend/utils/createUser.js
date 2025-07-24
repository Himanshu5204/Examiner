//LOAD models
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

//creating student
const createStudent = async (data) => {
    const { student_id, name, email, password, contact } = data;

    const newStudent = new Student({ student_id, name, email, password, contact });
    await newStudent.save();

    return newStudent;
}

//creating admin
const createAdmin = async (data) => {
    const { admin_id, name, email, password, contact } = data;

    const newAdmin = new Admin({ admin_id, name, email, password, contact });
    await newAdmin.save();

    return newAdmin;
}

//creating teacher
const createTeacher = async (data) => {
    const { teacher_id, name, email, password, contact } = data;

    const newTeacher = new Teacher({ teacher_id, name, email, password, contact });
    await newTeacher.save();

    return newTeacher;
}

module.exports = {
    createStudent,
    createTeacher,
    createAdmin
}