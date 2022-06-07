const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getActs,
  getAct,
  addAct,
  updateAct,
  deleteAct,
} = require("../controllers/medicalActs");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin", "secretary", "patient"), getActs)
  .post(protect, authorize("admin", "secretary"), addAct);

router
  .route("/:id")
  .get(protect, authorize("admin", "secretary"), getAct)
  .put(protect, authorize("admin", "secretary"), updateAct)
  .delete(protect, authorize("admin", "secretary"), deleteAct);
module.exports = router;
