/*
STUDENT API:
    - This API serve the request of 'api/student/'
*/

const express = require('express');
const router = express.Router();
const getExamSummery = require('../controller/getExamSummery');

//get-exam summery
router.get('/exam', async (req, res) => {
    const summaries = await getExamSummery();
    res.status(200).json(summaries);
});

module.exports = router;