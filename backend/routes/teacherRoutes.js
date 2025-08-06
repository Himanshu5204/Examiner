/*
TEACHER API:
    - This API serve the request of 'api/teacher/'
*/

const express = require('express');
const router = express.Router();
const TeacherList = require('../models/teacherList');
const Course = require('../models/course');
const Dept = require('../models/dept');

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

//(Important) upload file through Postman where key is 'xlsx' and value is excelfile

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
        data.forEach(async (row, index) => {
            const email = row['Email'];
            const courseCode = row['CourseCode'];
            const courseName = row['CourseNName'];
            const deptNo = row['DeptNo'];
            const deptName = row['DeptName'];
            const teacherId = row['TeacherId'];

            const teacher = new TeacherList({
                teacher_id: teacherId,
                email: email,
                course_id: courseCode,
                dept_code: deptNo,
            });

            const course = new Course({
                course_id: courseCode,
                name: courseName,
                dept_code: deptNo,
                teacher_id: teacherId
            });

            const dept = new Dept({
                dept_code: deptNo,
                name: deptName
            });

            await course.save();
            await teacher.save();
            await dept.save();

        });

        // this removes the temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'teacher list uploaded succesfully' });
    } catch (error) {

        /*
        *  excel file must be include these columns:
        *     - Email, CourseCode, CourseNName, DeptNo, DeptName
        */
        if (error.name === "ValidationError") {
            console.error('TeacherLust_Format_Error: ', error);
            res.status(400).json({ message: 'Error In Data' });
            return;
        }

        console.error('Error_Upload_TeacherList: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;