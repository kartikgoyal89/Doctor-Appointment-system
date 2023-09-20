const doctorModel = require("../models/doctorModel.js");
const appointmentModel = require('../models/appointmentModel.js');
const userModel = require('../models/userModels.js')

const getDoctorInfoController = async(req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor's data fetched succesfully!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting doctor's info",
      error,
    });
  }
};

const updateProfileController = async(req,res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate({userId: req.body.userId},req.body)
    res.status(200).send({
      success: true,
      message: "Updated Doctor's profile succesfully!",
      data: doctor
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating Doctor's profile",
      error
    })
  }
}


const getDoctorByIdController = async(req,res) => {
  try {
    const doctor = await doctorModel.findById({_id:req.body.id});
    res.status(200).send({
      success: true,
      message: "Doctor Details fetched Succesfully!",
      data: doctor
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting the Doctor by ID",
      error
    });
  }
}

const doctorAppointmentsController = async(req,res) => {
  try {
    const doctor = await doctorModel.findOne({userId:req.body.userId})
    const appointments = await appointmentModel.find({doctorId:doctor._id});
    res.status(200).send({
      success: true,
      message: "Doctor Appointment fetched succesfully!",
      data: appointments,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Doctors Appointment",
      error,
    })
  }
}

const updateStatusController = async(req,res) => {
  try {
    // get the appointment_id and status 
    const {appointmentsId,status} = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
    const user = await userModel.findOne({_id: appointments.userId});
    const notification = user.notification
    notification.push({
      type: 'Status Updated',
      message: `Your appointment has been updated ${status}`,
      onClickPath: '/doctor-appointments',
    })
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status updated"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the status",
      error
    })
  }
}



module.exports = {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController};