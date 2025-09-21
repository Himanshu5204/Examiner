const mongoose = require('mongoose');

const event = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        trim: true
    },

    event_date: {
        type: Date,
        require: true,
    },
});

const Event = mongoose.model("Event", event);

module.exports = Event;