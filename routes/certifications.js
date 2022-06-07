const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getMedicalCertifications,
  getMedicalCertificate,
  addMedicalCertificate,
  updateMedicalCertificate,
  deleteMedicalCertificate,
} = require("../controllers/medicalCertificate");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin", "secretary"), getMedicalCertifications)
  .post(protect, authorize("admin", "secretary"), addMedicalCertificate);

router
  .route("/:id")
  .get(protect, authorize("admin", "secretary"), getMedicalCertificate)
  .put(protect, authorize("admin", "secretary"), updateMedicalCertificate)
  .delete(protect, authorize("admin", "secretary"), deleteMedicalCertificate);

module.exports = router;
