const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv')

dotenv.config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`MongoDB Server Issue: ${error}`.bgRed.white);
    }
}


module.exports = connectDB;