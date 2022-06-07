const express = require("express");
const {
  getPrescriptions,
  createPrescription,
  updatePrescription,
} = require("../controllers/prescriptions");

// Include other resource routers
const medicationRouter = require("./medications");
const router = express.Router({ mergeParams: true });
// Re-route into other resource routers
router.use("/:prescriptionId/medications", medicationRouter);

router.route("/").get(getPrescriptions).post(createPrescription);
router.route("/:id").put(updatePrescription);

module.exports = router;
