const express = require("express");
const {
  getMedications,
  getDrug,
  addDrug,
  updateDrug,
} = require("../controllers/medication");

const router = express.Router({ mergeParams: true });

router.route("/").get(getMedications).post(addDrug);
router.route("/:id").get(getDrug).put(updateDrug);
module.exports = router;
