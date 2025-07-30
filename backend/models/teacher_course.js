const mongoose = require('mongoose');

const teacher_course = new mongoose.Schema({
    course_id: {
        type: String,
        require: true,
        trim: true,
        minlength: 8
    },

    teacher_id: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
});

const Teacher_course = mongoose.model("Teacher_course", teacher_course);
module.exports = Teacher_course;