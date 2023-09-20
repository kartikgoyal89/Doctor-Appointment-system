const express = require("express");
const colors = require('colors');
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const cors = require('cors');
const path = require('path')

// rest object
const app = express();

// MongoDB connection
connectDB();

// dotenv config
dotenv.config();

// middlewares
app.use(cors());
app.use(morgan());
app.use(express.json('dev'));
app.use(express.urlencoded({extended:true}))


// routes
app.use('/api/v1/user',require('./routes/userRoutes'));
app.use('/api/v1/admin',require('./routes/adminRoutes'));
app.use('/api/v1/doctor',require('./routes/doctorRoutes'));

// static files
app.use(express.static(path.join(__dirname,'../frontend/build')))

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})


// port
const PORT = process.env.PORT || 8080;

// listen PORT
app.listen(PORT,()=>{
    console.log(`Server is Running in ${process.env.DEV_MODE} on PORT: ${PORT}`.bgCyan.white);
})