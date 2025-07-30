const mongoose = require('mongoose');

const course_dept = new mongoose.Schema({
    course_id: {
        type: String,
        require: true,
        trim: true,
        minlength: 8
    },

    code: {
        type: String,
        require: true,
        trim: true,
        minlength: 8
    },
});

const Course_dept = mongoose.model("Course_dept", course_dept);
module.exports = Course_dept;