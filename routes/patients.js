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

const { protect, authorize } = require("../middleware/auth");

router.route("/radius/:zipcode/:distance").get(getPatientInRadius);

router
  .route("/")
  .get(
    protect,
    authorize("secretary", "admin"),
    advancedResults(Patient),
    getPatients
  )
  .post(protect, createPatient);

router
  .route("/:id")
  .get(protect, authorize("secretary", "admin"), getPatient)
  .put(protect, authorize("secretary", "admin"), updatePatient)
  .delete(protect, authorize("admin"), deletePatient);

module.exports = router;
