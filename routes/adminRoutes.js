const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const {getAllUsersController,getAllDoctorsController,changeAccountStatusController}  = require('../controllers/adminController');

const router = express.Router();


// GET ALL USERS 
router.get('/getAllUsers',authMiddleware,getAllUsersController)

// GET ALL DOCTORS
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController)


// CHANGE THE STATUS OF ACCOUNT || POST
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

module.exports = router;