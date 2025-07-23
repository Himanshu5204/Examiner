const mongoose = require('mongoose');

const teacher = new mongoose.Schema({
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
    }

}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacher);

exports.module = Teacher;