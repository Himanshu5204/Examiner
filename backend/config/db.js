const mongoose = require('mongoose');

/*
    - database connection using MONGO_URI under .env file
    - database server: MONGODB ATLAS
    - database name: examiner
*/
module.exports = connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected");

    } catch (error) {

        console.error("Error_Connecting_MongoDB: ", error);
        //exit with failure
        process.exit(1);

    }
};