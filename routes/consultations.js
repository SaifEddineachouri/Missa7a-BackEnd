const express = require("express");
const {
  getConsultation,
  getConsultations,
  getTodayConsultations,
  addConsultation,
  updateConsultation,
  payConsultation,
} = require("../controllers/consultations");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

const actsRouter = require("../routes/acts");
const prescriptionRouter = require("../routes/prescriptions");
const certificationRouter = require("../routes/certifications");

router.use("/:consultationId/acts", actsRouter);
router.use("/:consultationId/prescription", prescriptionRouter);
router.use("/:consultationId/certification", certificationRouter);

router
  .route("/")
  .get(protect, authorize("secretary", "admin", "patient"), getConsultations)
  .post(protect, authorize("secretary", "admin"), addConsultation);

router
  .route("/today")
  .get(protect, authorize("secretary", "admin"), getTodayConsultations);

router.route("/:id").get(getConsultation).put(updateConsultation);
router.route("/:id/payment").put(payConsultation);
module.exports = router;
