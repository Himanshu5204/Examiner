const mongoose = require('mongoose');

const student = new mongoose.Schema({

    id: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10
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
    }

}, { timestamps: true });

const Student = mongoose.model("Student", student);

exports.module = Student;