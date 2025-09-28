const mongoose = require('mongoose');

const studentList = new mongoose.Schema(
    {
        student_id: {
            type: String,
            require: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            trim: true
        },
        dept_code: {
            type: String,
            require: true,
            trim: true
        },
        course_id: {
            type: String,
            require: true,
            trim: true
        },
        gender: {
            type: String,
            require: true,
            trim: true,
        },
        loggedin: {
            type: Boolean,
            default: false
        }
    }
);

const StudentList = mongoose.model('StudentList', studentList);

module.exports = StudentList;
