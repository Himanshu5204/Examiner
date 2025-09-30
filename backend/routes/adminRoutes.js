/*
ADMIN API:
    - This API serve the request of 'api/admin/'
*/

// const storeTeacherList = require('../controller/storeTeacherList'); -> this give error

const express = require('express');
const router = express.Router();
const TeacherList = require('../models/teacherList');
const Course = require('../models/course');
const Dept = require('../models/dept');

//Import packages for excel file upload
const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');
const getAllCounts = require('../controller/Admin/getAllCounts');
const getDeptWiseResult = require('../controller/Admin/getDeptWiseResult');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/Admin');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

//(Important) upload file through Postman where key is 'xlsx' and value is excelfile

//upload.single('xlsx') will store file into temporary storage
router.post('/teacherList', upload.single('xlsx'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Key must be "xlsx".' });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    let savedCount = 0;
    let skippedRows = [];

    for (const [index, row] of data.entries()) {
      const email = row['Email'];
      const courseCode = row['CourseCode'];
      const courseName = row['CourseName'];
      const deptNo = row['DeptNo'];
      const deptName = row['DeptName'];
      const teacherId = row['TeacherId'];

      // Check required columns
      if (!email || !courseCode || !courseName || !deptNo || !deptName || !teacherId) {
        skippedRows.push({ index: index + 2, reason: 'Missing required columns' });
        continue;
      }

      try {

        // Check for existing dept
        const existingDept = await Dept.findOne({ dept_code: deptNo });
        if (!existingDept) {

          const dept = new Dept({
            dept_code: deptNo,
            name: deptName
          });
          await dept.save();
        }

        // Check for existing course
        const existingCourse = await Course.findOne({ course_id: courseCode });
        const existingTeacher = await TeacherList.findOne({ teacher_id: teacherId });

        if (!existingCourse) {
          const course = new Course({
            course_id: courseCode,
            name: courseName,
            dept_code: deptNo,
            teacher_id: teacherId
          });
          await course.save();

          if (!existingTeacher) {
            const teacher = new TeacherList({
              teacher_id: teacherId,
              email: email,
              course_id: courseCode,
              dept_code: deptNo
            });
            await teacher.save();
          } else {
            skippedRows.push({ index: index + 2, reason: 'Duplicate Teacher' });
          }

        } else {
          skippedRows.push({ index: index + 2, reason: 'Duplicate Course' });
        }

        // Check for existing teacher
        // const existingTeacher = await TeacherList.findOne({ teacher_id: teacherId });
        // if (!existingTeacher) {
        //   const teacher = new TeacherList({
        //     teacher_id: teacherId,
        //     email: email,
        //     course_id: courseCode,
        //     dept_code: deptNo
        //   });
        //   await teacher.save();
        // } else {
        //   skippedRows.push({ index: index + 2, reason: 'Duplicate teacher' });
        // }



        savedCount++;
      } catch (err) {
        skippedRows.push({ index: index + 2, reason: err.message });
      }
    }

    // remove temp file safely
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('File cleanup skipped:', err.message);
    }

    res.status(200).json({
      message: 'Teacher list processed.',
      saved: savedCount,
      skipped: skippedRows
    });
  } catch (error) {
    console.error('TeacherList Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/counts', getAllCounts);

router.get('/getResults', async (req, res) => {
  try {
    const result = await getDeptWiseResult();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;

// const existingCourse = await Course.findOne({ course_id: courseCode });
// if (!existingCourse) {
//     const course = new Course({
//         course_id: courseCode,
//         name: courseName,
//         dept_code: deptNo,
//         teacher_id: teacherId
//     });
//     await course.save();
// }else {
//   skippedRows.push({ index: index + 2, reason: 'Duplicate teacher' });
// }


// const existingDept = await Dept.findOne({ dept_code: deptNo });
// if (!existingDept) {
//     const dept = new Dept({
//         dept_code: deptNo,
//         name: deptName
//     });
//     await dept.save();
// }else {
//   skippedRows.push({ index: index + 2, reason: 'Duplicate teacher' });
// }


// const existingTeacher = await TeacherList.findOne({ teacher_id: teacherId });
// if (!existingTeacher) {
//     const teacher = new TeacherList({
//         teacher_id: teacherId,
//         email: email,
//         course_id: courseCode,
//         dept_code: deptNo,
//     });
//     await teacher.save();
// }else {
//   skippedRows.push({ index: index + 2, reason: 'Duplicate teacher' });
// }
