const PDFDocument = require('pdfkit');
const fs = require('fs');

const removeExtra = (str) => {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
        if (('a' <= str[i] && str[i] <= 'z') || ('A' <= str[i] && str[i] <= 'Z') || ('0' <= str[i] && str[i] <= '9')) {
            newStr += str[i];
        } else {
            newStr += '_';
        }
    }
    console.log(str);
    return newStr;
}

const generatePDF = async (data) => {

    return new Promise((resolve, reject) => {
        try {
            const studentName = removeExtra(data.pdfData.name);
            const studentEmail = data.pdfData.email;
            const studentCourseId = data.pdfData.courseId;
            const studntDept = data.pdfData.dept;
            const submitedDate = removeExtra(data.pdfData.date);
            const fileName = `${studentName + "_" + studntDept + "_" + studentCourseId + "_" + submitedDate}.pdf`;

            const doc = new PDFDocument({ margin: 20 });
            const filePath = `./upload/results/${fileName}`;
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // ===== HEADER SECTION =====
            doc.fontSize(10).fillColor('black')
                .text(`Name: ${studentName.toUpperCase()}`, { continued: true })
                .text(`    Email: ${studentEmail}`, { continued: true })
                .text(`    Course: ${studentCourseId}`, { continued: true })
                .text(`    Department: ${studntDept.toUpperCase()}`);

            doc.text(`Date: ${data.pdfData.date}`);
            doc.text(`Score: ${data.score}`, { continued: true });
            doc.text(`      Total: ${data.result.length}`);
            doc.moveDown(1);

            // ===== QUESTIONS =====
            data.result.forEach((q, index) => {
                doc.fontSize(9).fillColor('black')
                    .text(`Q${index + 1}. ${q.question}`);

                // console.log("opt,  correctAnswer,  selectedAnswer");
                // Print options
                q.options.forEach((opt, i) => {
                    const letter = String.fromCharCode(97 + i); // a,b,c...

                    // console.log(opt, q.correctAnswer, q.selectedAnswer);

                    if (opt === q.correctAnswer) {
                        if (q.selectedAnswer === opt) {
                            doc.fillColor('blue').text(`   ${letter}. ${opt}`);
                        } else {
                            doc.fillColor('red').text(`   ${letter}. ${opt}`);
                        }
                    } else {
                        doc.fillColor('black').text(`   ${letter}. ${opt}`);
                    }

                });

                // Correct option
                doc.fillColor('green')
                    .text(`Correct: ${q.correctAnswer}`);

                doc.moveDown(1);

                // Correct option
                doc.fillColor('black')
                    .text(`Reason: ${q.explanation}`);

                doc.moveDown(1);
            });

            // ===== END DOCUMENT =====
            doc.end();

            stream.on('finish', () => resolve(fileName));
            stream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });

};

module.exports = generatePDF;