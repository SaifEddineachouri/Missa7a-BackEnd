const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Patient = require("../models/Patient");

// @desc        Get all patients
// @route       GET api/v1/patients
// @access      Private
exports.getPatients = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get patient with cin
// @route       GET api/v1/patients/cin/:cin
// @access      Private
exports.getPatientWithCin = asyncHandler(async (req, res, next) => {
  const patient = await Patient.find({ cin: req.params.cin }).populate({
    path: "dossier appointment",
  });
  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with Cin of ${req.params.cin}`, 404)
    );
  }
  res.status(200).json({ success: true, data: patient });
});

// @desc        Get single patient
// @route       GET api/v1/patients/:id
// @access      Private
exports.getPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate({
    path: "dossier appointment",
  });
  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: patient });
});

// @desc        Get Visible patients
// @route       GET api/v1/patients/visible
// @access      Private
exports.getVisiblePatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find({ hidden: false }).populate({
    path: "dossier appointment",
  });
  if (!patients) {
    return next(new ErrorResponse(`All patients are hidden.`, 404));
  }
  res
    .status(200)
    .json({ success: true, count: patients.length, data: patients });
});

// @desc        Get Hidden patients
// @route       GET api/v1/patients/hidden
// @access      Private
exports.getHiddenPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find({ hidden: true }).populate({
    path: "dossier appointment",
  });
  if (!patients) {
    return next(new ErrorResponse(`All patients are visible.`, 404));
  }
  res
    .status(200)
    .json({ success: true, count: patients.length, data: patients });
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

// @desc        Archive patient
// @route       Archive api/v1/patients/archive/:id
// @access      Private
exports.archivePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { hidden: true },
    {
      // HIDDEN
      new: true,
      runValidators: true,
    }
  );

  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }
  // NEW: Update its status to "hidden" instead and deal with it manually in the front end

  res.status(200).json({ success: true, data: patient });
});

// @desc        Restore patient
// @route       RESTORE api/v1/patients/:id/restore
// @access      Private
exports.restorePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { hidden: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: patient });
});
