/*
STUDENT API:
    - This API serve the request of 'api/student/'
*/

const express = require('express');
const router = express.Router();
const path = require('path');
const getExamSummery = require('../controller/getExamSummery');
const getExamDeatils = require('../controller/getExamDeatils');
const getQuestionList = require('../controller/getQuestionList');
const submitExam = require('../controller/submitExam');
const getAllResults = require('../controller/getAllResults');
const getResult = require('../controller/getResult');
const generatePDF = require('../utils/generatePDF');
const getSchema = require('../utils/getSchema');

//get-exam summery
router.get('/user-exam/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const summaries = await getExamSummery(userId);
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

        const msg = await submitExam(student_id, exam_id, data);

        res.status(200).json({ message: msg });
    } catch (error) {
        console.error('TeacherList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/result/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const result = await getAllResults(studentId);

        console.log(result)

        res.status(200).json(result);
    } catch (error) {
        console.error('TeacherList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
})

router.post('/result', async (req, res) => {
    try {
        const { studentId, examId } = req.body;

        const result = await getResult(studentId, examId);
        generatePDF(result)
            .then((fileName) => {

                const filePath = path.join(__dirname, "../upload/results", fileName)
                console.log("Sending file:", filePath, "as", fileName);
                res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                res.setHeader("Content-Type", "application/pdf");

                // res.download(filePath, fileName, (err) => {
                //     if (err) {
                //         console.error('Error sending file:', err);
                //         res.status(500).send('Error downloading file.');
                //     }
                // });
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error("Error sending file:", err);
                        res.status(500).send("Error downloading file.");
                    }
                });

            })
            .catch((err) => {
                console.error('getResult Error:', err);
                res.status(500).json({ message: err.message });
            });

        // console.log(result)

    } catch (error) {
        console.error('getResult Error:', error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/get-dept/:Id', async (req, res) => {
    try {
        const Id = req.params.Id;
        const stud = getSchema['studentList'];
        const data = await stud.findOne({ student_id: Id });
        console.log(data);
        res.status(200).json({ dept: data.dept_code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error_get-dept" });
    }
})

module.exports = router;