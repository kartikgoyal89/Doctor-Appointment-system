const express = require("express");
const {
  loginController,
  registerController,
  authController,
  ApplyDoctorController,
  getAllNotificationController,
  getAllDoctorsController,
  deleteAllNotificationController,
  bookAppointmentController,
  userAppointmentsController,
  BookingAvailabiltyController,
} = require("../controllers/userController");



const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// routes

// LOGIN ROUTE
router.post("/login", loginController);

// REGISTER ROUTE
router.post("/register", registerController);

// AUTHORIZATION ROUTE
router.post("/getUserData", authMiddleware, authController);

// APPLY DOCTOR || POST
router.post("/apply-doctor", authMiddleware, ApplyDoctorController);

// READ ALL NOTIFICATIONS
router.post('/get-all-notification',authMiddleware,getAllNotificationController)

// DELETE ALL NOTIFICATIONS
router.post('/delete-all-notifications',authMiddleware,deleteAllNotificationController)


// GET ALL DOCTORS
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);


// BOOK APPOINTMENT || POST
router.post('/book-appointment',authMiddleware,bookAppointmentController);

// CHECK BOOKING AVAILABILITY || POST
router.post('/booking-availability',authMiddleware,BookingAvailabiltyController);


// APPOINTMENTS LIST || GET
router.get('/user-appointments',authMiddleware,userAppointmentsController);

module.exports = router;
