const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId:{
        type: String,
    },
    firstName:{
        type: String,
        required: [true,'first name is required!'],
    },
    lastname:{
        type: String,
        required: [true,'last name is required!']
    },
    phone:{
        type: String,
        required: [true,'Contact info is required!'],
    },
    email:{
        type: String,
        required:[true,'Email is required!'],
    },
    website:{
        type: String,
    },
    address:{
        type: String,
        required: [true,'Address is required!'],
    },
    specialization:{
        type: String,
        required: [true,'Specialization is required!'],
    },
    experience:{
        type: String,
        required:[true,'Experience is required!'],
    },
    feesPerConsultation: {
        type: Number,
        required: [true,'Fee is required!']
    },
    status:{
        type: String,
        default: 'pending',
    },
    timings:{
        type: Object,
        required: [true,'work timings is required!'],
    }
},{timestamps:true});


const doctorModel = mongoose.model("Doctors",doctorSchema);

module.exports = doctorModel;