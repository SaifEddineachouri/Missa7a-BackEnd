const express = require("express");
const {
  getAppointments,
  getTodayAppointments,
  BatchData,
  InProgressAppointment,
  NextAppointment,
  FinishAppointment,
  AbsenceAppointment,
  remindAppointment,
} = require("../controllers/appointment");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(getAppointments);
router.route("/today").get(getTodayAppointments);
router.route("/Batch").post(BatchData);

router.route("/:id/inprogress").put(InProgressAppointment);
router.route("/:id/next").put(NextAppointment);
router.route("/:id/finish").put(FinishAppointment);
router.route("/:id/absence").put(AbsenceAppointment);
module.exports = router;
