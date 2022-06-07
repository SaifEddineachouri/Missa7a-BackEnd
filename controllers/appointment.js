const asyncHandler = require("../middleware/async");
const Appointment = require("../models/Appointment");
const ErrorResponse = require("../utils/errorResponse");
const Patient = require("../models/Patient");
const momentTimeZone = require("moment-timezone");
const moment = require("moment");

const getTimeZones = function () {
  return momentTimeZone.tz.names();
};

// @desc        Get all appointments
// @route       GET api/v1/appointments
// @access      Private
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.find().populate({
    path: "patient",
    select: "",
  });

  res.send(appointment);
});

// @desc        Get today appointments
// @route       GET api/v1/appointments/today
// @access      Private
exports.getTodayAppointments = asyncHandler(async (req, res, next) => {
  var startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  var endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const appointment = await Appointment.find({
    StartTime: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate({
    path: "patient",
    select: "",
  });
  res.status(200).json({
    success: true,
    data: appointment,
  });
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

// @desc        In progress Appointment
// @route       PUT api/v1/appointments/:id/inprogress
// @access      Private
exports.InProgressAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(
      new ErrorResponse(`No Appointment with the id of ${req.params.id}`),
      404
    );
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { Status: "En Cours" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc        Next Appointment
// @route       PUT api/v1/appointments/:id/next
// @access      Private
exports.NextAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(
      new ErrorResponse(`No Appointment with the id of ${req.params.id}`),
      404
    );
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { Status: "Suivant" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc        Finished Appointment
// @route       PUT api/v1/appointments/:id/finish
// @access      Private
exports.FinishAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(
      new ErrorResponse(`No Appointment with the id of ${req.params.id}`),
      404
    );
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { Status: "Terminé" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc        Absence Appointment
// @route       PUT api/v1/appointments/:id/absence
// @access      Private
exports.AbsenceAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(
      new ErrorResponse(`No Appointment with the id of ${req.params.id}`),
      404
    );
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { Status: "Absence" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});
