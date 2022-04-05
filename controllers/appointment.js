const asyncHandler = require("../middleware/async");
const Appointment = require("../models/Appointment");
// @desc        Get all appointments
// @route       GET api/v1/appointments
// @access      Private
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.find({});

  res.send(appointment);
});

exports.BatchData = asyncHandler(async (req, res, next) => {
  var eventData = [];
  if (
    req.body.action == "insert" ||
    (req.body.action == "batch" && req.body.added.length > 0)
  ) {
    req.body.action == "insert"
      ? eventData.push(req.body.value)
      : (eventData = req.body.added);
    for (var i = 0; i < eventData.length; i++) {
      var sdate = new Date(eventData[i].StartTime);
      var edate = new Date(eventData[i].EndTime);
      eventData[i].StartTime = sdate;
      eventData[i].EndTime = edate;
      Appointment.create(eventData[i]);
    }
  }
  if (
    req.body.action == "update" ||
    (req.body.action == "batch" && req.body.changed.length > 0)
  ) {
    req.body.action == "update"
      ? eventData.push(req.body.value)
      : (eventData = req.body.changed);
    for (var i = 0; i < eventData.length; i++) {
      let appointment = await Appointment.findById(eventData[i]._id);
      var sdate = new Date(eventData[i].StartTime);
      var edate = new Date(eventData[i].EndTime);
      eventData[i].StartTime = sdate;
      eventData[i].EndTime = edate;

      appointment = await Appointment.findByIdAndUpdate(
        eventData[i]._id,
        eventData[i],
        {
          new: true,
          runValidators: true,
        }
      );
    }
  }
  if (
    req.body.action == "remove" ||
    (req.body.action == "batch" && req.body.deleted.length > 0)
  ) {
    req.body.action == "remove"
      ? eventData.push({ Id: req.body.key })
      : (eventData = req.body.deleted);
    for (var i = 0; i < eventData.length; i++) {
      const appointment = await Appointment.findById(eventData[i]._id);
      appointment.remove();
    }
  }
  res.send(req.body);
});
