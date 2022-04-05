const express = require("express");
const Appointment = require("../models/Appointment");
const advancedResults = require("../middleware/advancedResults");
const { getAppointments, BatchData } = require("../controllers/appointment");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(getAppointments);
router.route("/BatchData").post(BatchData);

module.exports = router;
