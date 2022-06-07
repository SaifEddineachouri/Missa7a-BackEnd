const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Prescription = require("../models/Prescription");
const Consultation = require("../models/Consultation");
const Medication = require("../models/Medication");

// @desc        Get all Prescriptions
// @route       GET api/v1/consultations/:consultationId/prescription
// @route       GET api/v1/prescriptions
// @access      Private
exports.getPrescriptions = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.consultationId) {
    query = Prescription.find({
      consultation: req.params.consultationId,
    }).populate({
      path: "consultation",
      select: "",
    });
  } else {
    query = Prescription.find().populate({
      path: "consultation",
      select: "",
    });
  }

  const prescriptions = await query;

  res.status(200).json({
    success: true,
    count: prescriptions.length,
    data: prescriptions,
  });
});

// @desc        Get single prescription
// @route       GET api/v1/prescriptions/:id
// @access      Private
exports.getPrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) {
    return next(
      new ErrorResponse(
        `Prescription not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: prescription });
});

// @desc        Create new Prescription
// @route       POST api/v1/prescription
// @route       POST api/v1/consultations/:consultationId/prescription
// @access      Private
exports.createPrescription = asyncHandler(async (req, res, next) => {
  req.body.consultation = req.params.consultationId;
  const { medications } = req.body;

  const consultation = await Consultation.findById(req.params.consultationId);

  if (!consultation) {
    return next(
      new ErrorResponse(
        `No Consultation with the id of ${req.params.consultationId}`,
        404
      )
    );
  }

  const post = new Prescription({
    NomDocteur: req.body.NomDocteur,
    PrenomDocteur: req.body.PrenomDocteur,
    NomPatient: req.body.NomPatient,
    PrenomPatient: req.body.PrenomPatient,
    consultation: req.body.consultation,
  });

  let createPrescription = await post.save();

  for (
    let i = 0;
    i < medications.length;
    i++ // parcours aal array of medications w tsavi bel wehed bel wehed fel database
  ) {
    medications[i].prescription = createPrescription._id;
    await Medication.create(medications[i]);
    createPrescription.medications.push(medications[i]);
  }
  res.status(201).json({
    success: true,
    data: createPrescription,
  });
});

// @desc        Update Prescription
// @route       PUT api/v1/prescriptions/:id
// @access      Private
exports.updatePrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!prescription) {
    return next(
      new ErrorResponse(
        `Prescription not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: prescription });
});
