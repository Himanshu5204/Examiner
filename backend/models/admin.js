const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    admin_id: {
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
    }

}, { timestamps: true });

const Admin = mongoose.model("Admin", admin);

module.exports = Admin;