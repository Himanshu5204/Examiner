const mongoose = require('mongoose');

const course = new mongoose.Schema({
    course_id: {
        type: String,
        require: true,
        trim: true,
        minlength: 8
    },

    name: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
});

const Course = mongoose.model("Course", course);
module.exports = Course;