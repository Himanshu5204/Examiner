const getSchema = require('../../utils/getSchema');
const getGenderCounts = require('../Analytics/getGenderCounts');
// const StudentList = getSchema['studentList'];
const TeacherList = getSchema['teacherList'];
const Course = getSchema['course'];

const getAllCounts = async (req, res) => {
    try {
        const teacherCounts = await TeacherList.countDocuments();
        const courses = await Course.find({}, { course_id: 1, dept_code: 1, _id: 0 });
        const deptWiseCount = [];

        //forEach loop not work with async await
        let male = 0, female = 0;
        for (const crs of courses) {
            const result = await getGenderCounts(crs.course_id, crs.dept_code);
            // console.log(result);
            male += result.totalMale
            female += result.totalFemale
            deptWiseCount.push({
                ...result,
                course: crs.course_id, dept: crs.dept_code
            });
        };

        console.log(deptWiseCount);
        res.status(200).json({ deptWiseCount, teacherCounts, totalMale: male, totalFemale: female });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error In getAllCounts" });
    }
}

module.exports = getAllCounts;