const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Folder = require("../models/Folder");
const Patient = require("../models/Patient");

// @desc        Get All Medical Folders
// @route       GET api/v1/dossiers
// @route       GET api/v1/patients/:patientId/dossier
// @access      Private
exports.getDossiers = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.patientId) {
    query = Folder.find({ patient: req.params.patientId }).populate({
      path: "patient",
      select: "Prenom Nom cin numeroTel",
    });
  } else {
    query = Folder.find().populate({
      path: "patient",
      select: "Prenom Nom cin numeroTel",
    });
  }

  const dossiers = await query;

  res.status(200).json({
    success: true,
    count: dossiers.length,
    data: dossiers,
  });
});

// @desc        Get single Medical Folder
// @route       GET api/v1/dossiers/:id
// @access      Private
exports.getDossier = asyncHandler(async (req, res, next) => {
  const dossier = await Folder.findById(req.params.id).populate({
    path: "patient",
    select: "Prenom Nom cin numeroTel",
  });

  if (!dossier) {
    return next(
      new ErrorResponse(`No Medical Folder with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: dossier,
  });
});

// @desc        Add Medical Folder
// @route       POST api/v1/patient/:patientId/dossier
// @access      Private
exports.addDossier = asyncHandler(async (req, res, next) => {
  req.body.patient = req.params.patientId;

  const patient = await Patient.findById(req.params.patientId);

  if (!patient) {
    return next(
      new ErrorResponse(`No Patient with the id of ${req.params.patientId}`),
      404
    );
  }
  const dossier = await Folder.create(req.body);
  res.status(200).json({
    success: true,
    data: dossier,
  });
});

// @desc        Update Medical Folder
// @route       PUT api/v1/dossier/:id
// @access      Private
exports.updateDossier = asyncHandler(async (req, res, next) => {
  let dossier = await Folder.findById(req.params.id);

  if (!dossier) {
    return next(
      new ErrorResponse(`No Medical Folder with the id of ${req.params.id}`),
      404
    );
  }

  dossier = await Folder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: dossier,
  });
});

// @desc        Delete Medical Folder
// @route       DELETE api/v1/dossier/:id
// @access      Private
exports.deleteDossier = asyncHandler(async (req, res, next) => {
  const dossier = await Folder.findById(req.params.id);

  if (!dossier) {
    return next(
      new ErrorResponse(`No Medical Folder with the id of ${req.params.id}`),
      404
    );
  }

  await dossier.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
