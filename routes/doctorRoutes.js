const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController} = require('../controllers/doctorController')
const {getAllDoctorsController} = require('../controllers/userController');

const router = express.Router();


// GET SINGLE DOCTOR INFORMATION
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

// UPDATE DOCTORS PROFILE || POST
router.post('/updateProfile',authMiddleware,updateProfileController)

// GET SINGLE DOCTOR || POST
router.post('/getDoctorById',authMiddleware,getDoctorByIdController)


//  GET ALL APPOINTMENTS
router.get('/doctor-appointments',authMiddleware,doctorAppointmentsController);

// CHANGE APPOINTMENT STATUS
router.post('/update-status',authMiddleware,updateStatusController);

module.exports = router;