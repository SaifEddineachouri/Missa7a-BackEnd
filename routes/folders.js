const express = require("express");
const {
  getDossiers,
  getDossier,
  addDossier,
  updateDossier,
  deleteDossier,
} = require("../controllers/folders");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("secretary", "admin"), getDossiers)
  .post(protect, authorize("secretary", "admin"), addDossier);
router
  .route("/:id")
  .get(getDossier)
  .put(protect, authorize("secretary", "admin"), updateDossier)
  .delete(protect, authorize("admin"), deleteDossier);

module.exports = router;
