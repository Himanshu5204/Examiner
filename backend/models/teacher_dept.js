const mongoose = require('mongoose');

const teacher_dept = new mongoose.Schema({
    code: {
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

const Teacher_dept = mongoose.model("Teacher_dept", teacher_dept);
module.exports = Teacher_dept;