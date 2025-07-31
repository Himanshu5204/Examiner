const mongoose = require('mongoose');

const student = new mongoose.Schema({

    student_id: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },

    name: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },

    email: {
        type: String,
        require: true,
        trim: true,
    },

    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 8
    },

    contact: {
        type: String,
        require: true,
        trim: true,
        minlength: 10
    },
    token: {
        type: String
    }

}, { timestamps: true });

const Student = mongoose.model("Student", student);

module.exports = Student;