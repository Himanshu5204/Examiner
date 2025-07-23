//IMPORT PACKAGES
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

//CONFIGURATION FOR APPLICATION
dotenv.config();

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 80;
const app = express();
app.use(express.json());
app.use(cors());

//ROUTES
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server Started")
    });
})
