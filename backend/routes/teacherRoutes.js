const express = require('express');
const router = express.Router();
const StudentList = require('../models/studentList');
const saveExam = require('../controller/saveExam');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '../upload/Teacher');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/exam', saveExam);

// StudentList Upload
router.post('/studentList', upload.single('xlsx'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded. Key must be "xlsx".' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        await Promise.all(data.map(async (row) => {
            if (!row.StudentId || !row.Email || !row.CourseCode || !row.DeptNo) {
                throw new Error('Excel file missing required columns.');
            }
            const student = new StudentList({
                student_id: row.StudentId,
                email: row.Email,
                course_id: row.CourseCode,
                dept_code: row.DeptNo,
            });
            await student.save();
        }));

        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Student list uploaded successfully.' });
    } catch (error) {
        console.error('StudentList Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;