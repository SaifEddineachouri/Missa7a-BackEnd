const asyncHandler = require("../middleware/async");
const Consultation = require("../models/Consultation");
const Certificate = require("../models/MedicalCertificate");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get Certificate
// @route       GET api/v1/certifications
// @route       GET api/v1/consultations/:consultationId/certification
// @access      Private
exports.getMedicalCertifications = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.consultationId) {
    query = Certificate.find({
      consultation: req.params.consultationId,
    }).populate({
      path: "consultation",
      select: "CodeCons DiagnoCons Motif",
    });
  } else {
    query = Certificate.find({}).populate({
      path: "consultation",
      select: "CodeCons DiagnoCons Motif",
    });
  }

  const Certifications = await query;

  res.status(200).json({
    success: true,
    count: Certifications.length,
    data: Certifications,
  });
});

// @desc        Get single Medical Certificate
// @route       GET api/v1/certifications/:id
// @access      Private
exports.getMedicalCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id).populate({
    path: "consultation",
    select: "CodeCons DiagnoCons Motif",
  });

  if (!certificate) {
    return next(
      new ErrorResponse(
        `No Certificate found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: certificate,
  });
});

// @desc        Add Medical Certificate
// @route       POST api/v1/consultations/:consultationId/certifications
// @access      Private
exports.addMedicalCertificate = asyncHandler(async (req, res, next) => {
  req.body.consultation = req.params.consultationId;

  const consultation = await Consultation.findById(req.params.consultationId);

  if (!consultation) {
    return next(
      new ErrorResponse(
        `No Consultation with the id of ${req.params.consultationId}`,
        404
      )
    );
  }
  const certificate = await Certificate.create(req.body);

  res.status(201).json({
    success: true,
    data: certificate,
  });
});

// @desc        Update Medical Certificate
// @route       PUT api/v1/Acts/:id
// @access      Private
exports.updateMedicalCertificate = asyncHandler(async (req, res, next) => {
  let certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return next(
      new ErrorResponse(
        `No Medical Certificate with the id of ${req.params.id}`,
        404
      )
    );
  }
  certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: certificate,
  });
});

// @desc        Delete Medical Certificate
// @route       DELETE api/v1/Acts/:id
// @access      Private
exports.deleteMedicalCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return next(
      new ErrorResponse(
        `No Medical Certificate with the id of ${req.params.id}`,
        404
      )
    );
  }
  await certificate.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
