const mongoose = require('mongoose');

const teacherList = new mongoose.Schema(
    {
        teacher_id: {
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
        loggedin: {
            type: Boolean,
            default: false
        }
    }
);

const TeacherList = mongoose.model('TeacherList', teacherList);

module.exports = TeacherList;
