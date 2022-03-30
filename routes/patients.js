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
const { protect, authorize } = require("../middleware/auth");
const Patient = require("../models/Patient");

// Include other resource routers
const dossierRouter = require("./folders");

const router = express.Router();

// Re-route into other resource routers
router.use("/:patientId/dossier", dossierRouter);

router.route("/radius/:zipcode/:distance").get(getPatientInRadius);

router
  .route("/")
  .get(
    protect,
    authorize("secretary", "admin"),
    advancedResults(Patient, "dossier"),
    getPatients
  )
  .post(protect, createPatient);

router
  .route("/:id")
  .get(protect, authorize("secretary", "admin"), getPatient)
  .put(protect, authorize("secretary", "admin"), updatePatient)
  .delete(protect, authorize("admin"), deletePatient);

module.exports = router;
