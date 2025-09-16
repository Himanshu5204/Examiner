/*
STUDENT API:
    - This API serve the request of 'api/student/'
*/

const express = require('express');
const router = express.Router();
const getExamSummery = require('../controller/getExamSummery');
const getExamDeatils = require('../controller/getExamDeatils');
const getQuestionList = require('../controller/getQuestionList');

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

module.exports = router;