const mongoose = require('mongoose');

const course = new mongoose.Schema({
    course_id: {
        type: String,
        require: true,
        trim: true
    },

    name: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },

    dept_code: {
        type: String,
        require: true,
        trim: true
    },

    teacher_id: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
});

const Course = mongoose.model("Course", course);
module.exports = Course;