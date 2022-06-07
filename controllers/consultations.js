const asyncHandler = require("../middleware/async");
const Consultation = require("../models/Consultation");
const FinancialAccount = require("../models/FinancialAccount");
const Dossier = require("../models/Folder");
const Acte = require("../models/MedicalAct");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get All Consultations
// @route       GET api/v1/consultations
// @route       GET api/v1/dossiers/:dossierId/consultations
// @access      Private
exports.getConsultations = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.dossierId) {
    query = Consultation.find({ dossier: req.params.dossierId }).populate({
      path: "medicalActs prescription certificate",
    });
  } else {
    query = Consultation.find().populate({
      path: "medicalActs prescription",
    });
  }

  const consultations = await query;

  res.status(200).json({
    success: true,
    count: consultations.length,
    data: consultations,
  });
});

// @desc        Get Today Consultations
// @route       GET api/v1/consultations/today
// @access      Private
exports.getTodayConsultations = asyncHandler(async (req, res, next) => {
  var startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  var endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const consultations = await Consultation.find({
    createAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate({
    path: "dossier",
    populate: {
      path: "patient",
      model: "Patient",
    },
  });

  res.status(200).json({
    success: true,
    count: consultations.length,
    data: consultations,
  });
});

// @desc        Get single Consultation
// @route       GET api/v1/consultations/:id
// @access      Private
exports.getConsultation = asyncHandler(async (req, res, next) => {
  const consultation = await Consultation.findById(req.params.id).populate({
    path: "medicalActs prescription certificate dossier",
  });

  if (!consultation) {
    return next(
      new ErrorResponse(`No Consultation with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: consultation,
  });
});

// @desc        Add Consultation
// @route       POST api/v1/dossiers/:dossierId/consultations
// @access      Private
exports.addConsultation = asyncHandler(async (req, res, next) => {
  req.body.dossier = req.params.dossierId;
  const { medicalActs } = req.body;
  const dossier = await Dossier.findById(req.params.dossierId);

  if (!dossier) {
    return next(
      new ErrorResponse(
        `No Medical Folder with the Id of ${req.params.dossierId}`
      )
    );
  }
  const post = new Consultation({
    TensionSystolique: req.body.TensionSystolique,
    TensionDiastolique: req.body.TensionDiastolique,
    Temperature: req.body.Temperature,
    DiagnoCons: req.body.DiagnoCons,
    Motif: req.body.Motif,
    CommentaireCons: req.body.CommentaireCons,
    dossier: req.body.dossier,
  });

  let createConsultation = await post.save();

  for (
    let i = 0;
    i < medicalActs.length;
    i++ // parcours aal array of actes w tsavi bel wehed bel wehed fel database
  ) {
    medicalActs[i].consultation = createConsultation._id;
    await Acte.create(medicalActs[i]);
    createConsultation.medicalActs.push(medicalActs[i]);
  }
  res.status(201).json({
    success: true,
    data: createConsultation,
  });
});

// @desc        Update Consultation
// @route       PUT api/v1/consultations/:id
// @access      Private
exports.updateConsultation = asyncHandler(async (req, res, next) => {
  let consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    return next(
      new ErrorResponse(`No Consultation with the id of ${req.params.id}`),
      404
    );
  }

  consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: consultation,
  });
});

// @desc        Pay Consultation
// @route       PUT api/v1/consultations/:id/payment
// @access      Private
exports.payConsultation = asyncHandler(async (req, res, next) => {
  let CodeComp = req.body.CodeComp;
  let account = await FinancialAccount.findById(CodeComp);
  let consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    return next(
      new ErrorResponse(`No Consultation with the id of ${req.params.id}`),
      404
    );
  }

  consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { paid: "Payé" },
    {
      new: true,
      runValidators: true,
    }
  );

  account.InitBalance += consultation.sumTarif;
  await account.save();

  res.status(200).json({
    success: true,
    data: consultation,
  });
});
