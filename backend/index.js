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
const aiRoute = require('./ai-mcq/server');

const PORT = process.env.PORT || 80;
const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", 'Authorization'],
    exposedHeaders: ["Content-Disposition"]
}));

//ROUTES
app.use('/api/auth', authentication); //all user authentication
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/ai', aiRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Started http://localhost:${PORT}`);
    });
})
