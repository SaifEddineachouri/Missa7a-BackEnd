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
    query = Folder.find({ archived: false }).populate({
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

// @desc        Get Archived Medical Folders
// @route       GET api/v1/dossiers/archived
// @access      Private
exports.getArchivedDossiers = asyncHandler(async (req, res, next) => {
  const dossiers = await Folder.find({ archived: true }).populate({
    path: "patient",
    select: "Prenom Nom cin numeroTel",
  });

  if (!dossiers) {
    return next(new ErrorResponse(`All medical folders are visible.`), 404);
  }
  res.status(200).json({
    success: true,
    count: dossiers.length,
    data: dossiers,
  });
});

// @desc        Add Medical Folder
// @route       POST api/v1/patients/:patientId/dossier
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

  const {
    TaillePatient,
    PoidsPatient,
    TensionArterielle,
    Temperature,
    PerimetrePatient,
    Antecedents,
    AllergiesMedicamenteuses,
    MaladiesHereditaires,
    AllergiesAlimentaires,
  } = req.body;

  const dossier = await Folder.create({
    Prenom: patient.Prenom,
    Nom: patient.Nom,
    TaillePatient,
    PoidsPatient,
    TensionArterielle,
    Temperature,
    PerimetrePatient,
    Antecedents,
    AllergiesMedicamenteuses,
    MaladiesHereditaires,
    AllergiesAlimentaires,
    files: req.files,
    patient,
  });
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

// @desc        Archive Medical Folder
// @route       Archive api/v1/dossier/archive/:id
// @access      Private
exports.archiveDossier = asyncHandler(async (req, res, next) => {
  let dossier = await Folder.findById(req.params.id);

  if (!dossier) {
    return next(
      new ErrorResponse(`No Medical Folder with the id of ${req.params.id}`),
      404
    );
  }

  dossier = await Folder.findByIdAndUpdate(
    req.params.id,
    { archived: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: dossier,
  });
});

// @desc        Restore Medical Folder
// @route       PUT api/v1/dossier/:id/restore
// @access      Private
exports.restoreDossier = asyncHandler(async (req, res, next) => {
  let dossier = await Folder.findById(req.params.id);

  if (!dossier) {
    return next(
      new ErrorResponse(`No Medical Folder with the id of ${req.params.id}`),
      404
    );
  }

  // NEW
  dossier = await Folder.findByIdAndUpdate(
    req.params.id,
    { archived: false },
    {
      new: true,
      runValidators: true,
    }
  );

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
