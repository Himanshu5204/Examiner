const mongoose = require('mongoose');

const exam = new mongoose.Schema({

    exam_id: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },

    teacher_id: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },

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

    live: {
        type: Boolean,
        default: false,
    },

    startTime: {
        type: Date,
        require: true
    },

    endTime: {
        type: Date,
        require: true
    },
}, { timestamps: true });

const Exam = mongoose.model("Exam", exam);

module.exports = Exam;