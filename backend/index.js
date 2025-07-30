//IMPORT PACKAGES
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

//CONFIGURATION FOR APPLICATION
dotenv.config();

const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const authentication = require('./routes/authentication');

const PORT = process.env.PORT || 80;
const app = express();
app.use(express.json());
app.use(cors());

//ROUTES
app.use('/api/auth', authentication); //all user authentication
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Started http://localhost:${PORT}`);
    });
})
