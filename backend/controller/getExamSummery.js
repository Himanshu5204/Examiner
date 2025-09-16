const getSchema = require('../utils/getSchema');
const exam = getSchema['exam'];
const course = getSchema['course'];
const teacher = getSchema['teacher'];

const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
};


const getExamSummery = async () => {
    const exams = await exam.find({}, { exam_id: 1, course_id: 1, teacher_id: 1, live: 1, startTime: 1, endTime: 1, _id: 0 });

    // console.log(exams);

    const formattedExams = exams.map(e => ({
        Id: e.exam_id,
        Course: e.course_id,
        Teacher: e.teacher_id,
        Start: e.startTime,
        End: e.endTime
    }));

    // const teacherData = await teacher.find({ teacher_id }, { name: 1 });
    // const data = [];
    /*
    {
        _id: new ObjectId('68c6d88138b166feda0ed94a'),
        exam_id: 'NiEseAow',
        teacher_id: 'deep12',
        course_id: 'JAVA201',
        dept_code: 'MC201',
        live: false,
        startTime: 2003-09-17T14:10:00.000Z,
        endTime: 2003-09-17T15:40:00.000Z,
        questions: [Array]
    }
    */
    console.log(formattedExams);
    return formattedExams;
};

module.exports = getExamSummery;