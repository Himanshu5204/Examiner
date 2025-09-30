const getSchema = require("../../utils/getSchema");
const studentList = getSchema['studentList'];

const getGenderCounts = async (courseId, dept_code) => {
    // const total = await studentList.countDocuments({ course_id: courseId });
    // const totalFemale = await studentList.countDocuments({ course_id: courseId, gender: "Female" });
    // const totalMale = await studentList.countDocuments({ course_id: courseId, gender: "Male" });

    const result = await studentList.aggregate([
        { $match: { course_id: courseId, dept_code: dept_code } },
        { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    let totalMale = 0, totalFemale = 0, total = 0;
    result.forEach(r => {
        if (r._id === "male") totalMale = r.count;
        if (r._id === "female") totalFemale = r.count;
        total += r.count;
    });
    // console.log(totalMale, totalFemale, total);
    return { totalMale, totalFemale, total };
}

module.exports = getGenderCounts;