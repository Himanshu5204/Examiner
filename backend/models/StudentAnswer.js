const mongoose = require("mongoose");

const studentAnswerSchema = new mongoose.Schema({
    student_id: String, // you can take from JWT/auth
    exam_id: String,
    answers: [
        {
            questionId: String,
            selectedOption: String,
        },
    ],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentAnswer", studentAnswerSchema);