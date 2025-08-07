//!!!This controller not being used Right Now

const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');

const storeTeacherList = async (req, res) => {
    try {
        const filePath = req.file.path;
        console.log(filePath + "<");
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
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

        fs.unlinkSync(filePath);
        
        res.json({ message: 'Excel file received and printed to console.' });

    } catch (error) {
        
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process Excel file' });

    }
}

module.exports = storeTeacherList;