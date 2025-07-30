/*
ADMIN API:
    - This API serve the request of 'api/admin/'
*/
// const storeTeacherList = require('../controller/storeTeacherList'); -> this give error
const express = require('express');
const router = express.Router();

//Import packages for excel file upload
const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/Admin");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

//upload file through Postman where key is 'xlsx' and value is excelfile

//upload.single('xlsx') will store file into temporary storage
router.post('/teacherList', upload.single('xlsx'), async (req, res) => {
    try {

        const filePath = req.file.path;
        console.log(filePath + "<FILE_PATH>");

        const workbook = xlsx.readFile(filePath); //getting workbook
        const sheetName = workbook.SheetNames[0]; //take first Sheet name

        const sheet = workbook.Sheets[sheetName]; //take sheet from workbook

        const data = xlsx.utils.sheet_to_json(sheet); // excel -> JSON

        //Printing into console or store it into DB
        data.forEach((row, index) => {
            const email = row['Email'];
            const courseCode = row['CourseCode'];
            const deptNo = row['DeptNo'];

            console.log(`Row ${index + 1}:`);
            console.log(`  Email      : ${email}`);
            console.log(`  CourseCode : ${courseCode}`);
            console.log(`  DeptNo     : ${deptNo}`);
            console.log('-------------------------');
        });

        // this removes the temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'teacher list uploaded succesfully' });
    } catch (error) {
        console.error('Error_Upload_TeacherList: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;