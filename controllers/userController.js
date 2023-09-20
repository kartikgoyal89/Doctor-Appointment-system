const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel.js");
const moment = require("moment");

dotenv.config();

// REGISTER CALLBACK
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists!", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(201)
      .send({ success: true, message: "Register Succesfully!", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller: ${error.message}`,
    });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Username/Password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Succesfull", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login Controller: ${error.message}",
    });
  }
};

// AUTHORIZATION CONTROLLER
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User Not found!", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Authorization Error", error });
  }
};

// APPLY DOCTOR CONTROLLER
const ApplyDoctorController = async (req, res) => {
  try {
    // take the data from the form and save it in the database
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // now send the notification to admin
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastname} has applied for a Doctor account!`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastname,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor's account applied Succesfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for Doctor",
    });
  }
};

// GET ALL NOTIFICATION CONTROLLER
const getAllNotificationController = async (req, res) => {
  try {
    // get the user
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// DELETE ALL NOTIFICATIONS
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted Succesfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting all notifications",
      error,
    });
  }
};

// GET ALL DOCTORS
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctor's List fetched Succesfully!",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Doctor's list",
      error,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    // first get the status of booking in req.body
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.date, "HH:mm").toISOString();

    req.body.status = "pending";
    // get the appointment and pass all the data getting
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    // now get the user and send the notification to the user
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-Appointment-request",
      message: `A new Appointment request from ${req.body.userInfo.name}`,
      onClickPath: "http://localhost:8080/api/v1/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment booked succesfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

const BookingAvailabiltyController = async (req, res) => {
  try {
    // first get the date and time
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;

    const appointment = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointment.length > 0) {
      return res.status(200).send({
        message: "Appointment not Available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "Appointment Available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "User Appointments fetched succesfully!",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Appointments list",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  getAllDoctorsController,
  authController,
  ApplyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  bookAppointmentController,
  BookingAvailabiltyController,
  userAppointmentsController,
};
