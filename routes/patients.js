const express = require("express");
const {
  getPatient,
  getHiddenPatients,
  getVisiblePatients,
  getPatientWithCin,
  getPatients,
  createPatient,
  updatePatient,
  archivePatient,
  restorePatient,
} = require("../controllers/patients");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const Patient = require("../models/Patient");

// Include other resource routers
const dossierRouter = require("./folders");
const consultationRouter = require("./consultations");
const appointmentRequestRouter = require("./appointmentsRequests");

const router = express.Router();

// Re-route into other resource routers
router.use("/:patientId/dossier", dossierRouter);
router.use("/:patientId/consultations", consultationRouter);
router.use("/:patientId/appointment/request", appointmentRequestRouter);

router
  .route("/hidden")
  .get(protect, authorize("secretary", "admin"), getHiddenPatients);
router
  .route("/visible")
  .get(protect, authorize("secretary", "admin"), getVisiblePatients);

router.route("/cin/:cin").get(protect, authorize("patient"), getPatientWithCin);

router
  .route("/")
  .get(
    protect,
    authorize("secretary", "admin"),
    advancedResults(Patient, "dossier"),
    getPatients
  )
  .post(protect, authorize("secretary", "admin"), createPatient);

router
  .route("/:id")
  .get(protect, authorize("secretary", "admin", "patient"), getPatient)
  .put(protect, authorize("secretary", "admin"), updatePatient);

router.route("/archive/:id").put(protect, authorize("admin"), archivePatient);
router.route("/:id/restore").put(protect, authorize("admin"), restorePatient);

module.exports = router;
