const asyncHandler = require("../middleware/async");
const AppointmentRequest = require("../models/AppointmentRequest");
const Appointment = require("../models/Appointment");
const ErrorResponse = require("../utils/errorResponse");
const Patient = require("../models/Patient");

// @desc        Get All Appointments Requests
// @route       GET api/v1/appointment/request
// @route       GET api/v1/patients/:patientId/appointment/request
// @access      Private
exports.getAppointmentsRequests = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.patientId) {
    query = AppointmentRequest.find({ patient: req.params.patientId }).populate(
      {
        path: "patient",
        select: "",
      }
    );
  } else {
    query = AppointmentRequest.find().populate({
      path: "patient",
      select: "",
    });
  }

  const appointmentsRequests = await query;

  res.status(200).json({
    success: true,
    count: appointmentsRequests.length,
    data: appointmentsRequests,
  });
});

// @desc        Get today Appointments Requests
// @route       GET api/v1/appointment/request/today
// @access      Private
exports.getTodayAppointmentsRequests = asyncHandler(async (req, res, next) => {
  var startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  var endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const appointmentsRequests = await AppointmentRequest.find({
    createAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate({
    path: "patient",
    select: "",
  });

  res.status(200).json({
    success: true,
    data: appointmentsRequests,
  });
});

// @desc        Demand Appointment Request
// @route       POST api/v1/patients/:patientId/appointment/request
// @access      Private
exports.demandAppointment = asyncHandler(async (req, res, next) => {
  req.body.patient = req.params.patientId;

  const patient = await Patient.findById(req.params.patientId);

  if (!patient) {
    return next(
      new ErrorResponse(
        `No Patient with the id of ${req.params.patientId}`,
        404
      )
    );
  }
  const appointmentRequest = await AppointmentRequest.create(req.body);

  res.status(201).json({
    success: true,
    data: appointmentRequest,
  });
});

// @desc        Confirm Appointment Request
// @route       PUT api/v1/appointment/request/:id/confirm
// @access      Private
exports.confirmAppointment = asyncHandler(async (req, res, next) => {
  let appointmentRequest = await AppointmentRequest.findById(req.params.id);
  if (!appointmentRequest) {
    return next(
      new ErrorResponse(
        `No Appointment Request with the id of ${req.params.id}`
      ),
      404
    );
  }

  appointmentRequest = await AppointmentRequest.findByIdAndUpdate(
    req.params.id,
    { status: "Confirmé" },
    {
      new: true,
      runValidators: true,
    }
  );

  await Appointment.create({
    Subject: appointmentRequest.Subject,
    StartTime: appointmentRequest.StartTime,
    EndTime: appointmentRequest.EndTime,
    Description: appointmentRequest.Description,
    patient: appointmentRequest.patient,
  });

  res.status(200).json({
    success: true,
    data: appointmentRequest,
  });
});

// @desc        Unconfirm Appointment Request
// @route       PUT api/v1/appointment/request/:id/unconfirm
// @access      Private
exports.unconfirmAppointment = asyncHandler(async (req, res, next) => {
  let appointmentRequest = await AppointmentRequest.findById(req.params.id);
  if (!appointmentRequest) {
    return next(
      new ErrorResponse(
        `No Appointment Request with the id of ${req.params.id}`
      ),
      404
    );
  }

  appointmentRequest = await AppointmentRequest.findByIdAndUpdate(
    req.params.id,
    { status: "Pas confirmé" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointmentRequest,
  });
});

// @desc        Update Appointment Request
// @route       PUT api/v1/appointment/request/:id
// @access      Private
exports.updateAppointmentRequest = asyncHandler(async (req, res, next) => {
  let appointmentRequest = await AppointmentRequest.findById(req.params.id);

  if (!appointmentRequest) {
    return next(
      new ErrorResponse(
        `No Appointment Request with the id of ${req.params.id}`
      ),
      404
    );
  }

  appointmentRequest = await AppointmentRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: appointmentRequest,
  });
});

// @desc        Delete Appointment Request
// @route       DELETE api/v1/appointment/request/:id
// @access      Private
exports.deleteAppointmentRequest = asyncHandler(async (req, res, next) => {
  const appointmentRequest = await AppointmentRequest.findById(req.params.id);

  if (!appointmentRequest) {
    return next(
      new ErrorResponse(
        `Appointment Request not found with id of ${req.params.id}`,
        404
      )
    );
  }
  appointmentRequest.remove();

  res.status(200).json({ success: true, data: [] });
});
