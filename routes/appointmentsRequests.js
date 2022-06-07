const express = require("express");
const {
  getAppointmentsRequests,
  getTodayAppointmentsRequests,
  demandAppointment,
  confirmAppointment,
  unconfirmAppointment,
  updateAppointmentRequest,
  deleteAppointmentRequest,
} = require("../controllers/appointmentRequest");

const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

router.route("/").post(demandAppointment).get(getAppointmentsRequests);
router.route("/today").get(getTodayAppointmentsRequests);
router.route("/:id/confirm").put(confirmAppointment);
router.route("/:id/unconfirm").put(unconfirmAppointment);
router
  .route("/:id")
  .put(updateAppointmentRequest)
  .delete(deleteAppointmentRequest);

module.exports = router;
