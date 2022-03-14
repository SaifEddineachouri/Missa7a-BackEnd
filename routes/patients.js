const express = require("express");
const {
  getPatient,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientInRadius,
} = require("../controllers/patients");

const advancedResults = require("../middleware/advancedResults");
const Patient = require("../models/Patient");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getPatientInRadius);

router
  .route("/")
  .get(advancedResults(Patient), getPatients)
  .post(createPatient);

router.route("/:id").get(getPatient).put(updatePatient).delete(deletePatient);

module.exports = router;
