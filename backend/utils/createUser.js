//LOAD models
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

//creating student
const bcrypt = require('bcrypt');

const createStudent = async (data) => {
    const { student_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newStudent = new Student({ student_id, name, email, password: hashedPassword, contact, role: 'student' });
    await newStudent.save();
    return newStudent;
}

//creating admin
const createAdmin = async (data) => {
    const { admin_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newAdmin = new Admin({ admin_id, name, email, password: hashedPassword, contact,role: 'admin' });
    await newAdmin.save();

    return newAdmin;
}

//creating teacher
const createTeacher = async (data) => {
    const { teacher_id, name, email, password, contact } = data;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const newTeacher = new Teacher({ teacher_id, name, email, password: hashedPassword, contact,role: 'teacher' });
    await newTeacher.save();

    return newTeacher;
}

module.exports = {
    createStudent,
    createTeacher,
    createAdmin
}