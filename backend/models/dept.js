const mongoose = require('mongoose');

const dept = new mongoose.Schema({
    code: {
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

const Dept = mongoose.model("Dept", dept);

module.exports = Dept;