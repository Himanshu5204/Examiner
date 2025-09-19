/*
STUDENT API:
    - This API serve the request of 'api/student/'
*/

const express = require('express');
const router = express.Router();
const getExamSummery = require('../controller/getExamSummery');
const getExamDeatils = require('../controller/getExamDeatils');
const getQuestionList = require('../controller/getQuestionList');
const submitExam = require('../controller/submitExam');

//get-exam summery
router.get('/exam', async (req, res) => {
    const summaries = await getExamSummery();
    res.status(200).json(summaries);
});

router.get('/exam/:examId', async (req, res) => {
    try {
        const ID = req.params.examId;
        // const examDeatils = await Exam.
        const ques = await getQuestionList(ID);

        console.log(ques);
        res.status(200).json(ques);
    } catch (error) {
        console.error('TeacherList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/examDetails/:examId', async (req, res) => {
    try {
        const ID = req.params.examId;
        // const examDeatils = await Exam.
        const details = await getExamDeatils(ID);

        console.log(details);
        res.status(200).json(details);
    } catch (error) {
        console.error('TeacherList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// http://localhost:8000/api/student/exam/NaN0ZZGF
router.post('/exam/:examId', async (req, res) => {
    try {
        const exam_id = req.params.examId;
        const { student_id, data } = req.body;

        await submitExam(student_id, exam_id, data);

        res.status(200).json({ message: "Done" });
    } catch (error) {
        console.error('TeacherList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;