const mongoose = require('mongoose');

const notice = new mongoose.Schema(
    {
        text: {
            type: String,
            require: true,
            trim: true
        },
    },
    { timestamps: true }
);

const Notice = mongoose.model("Notice", notice);

module.exports = Notice;