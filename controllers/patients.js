const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Patient = require("../models/Patient");

// @desc        Get all patients
// @route       GET api/v1/patients
// @access      Private
exports.getPatients = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single patients
// @route       GET api/v1/patients/:id
// @access      Private
exports.getPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: patient });
});

// @desc        Create new patient
// @route       POST api/v1/patients
// @access      Private
exports.createPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.create(req.body);
  res.status(201).json({ success: true, data: patient });
});

// @desc        Update patient
// @route       PUT api/v1/patients/:id
// @access      Private
exports.updatePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: patient });
});

// @desc        Update patient
// @route       DELETE api/v1/patients/:id
// @access      Private
exports.deletePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: [] });
});

// @desc        Get patients within a radius
// @route       GET api/v1/patients/radius/:zipcode/:distance
// @access      Private
exports.getPatientInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 6,378 km

  const radius = distance / 6378;

  const patients = await Patient.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});
