const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Medication = require("../models/Medication");
const Prescription = require("../models/Prescription");

// @desc        Get all Medications
// @route       GET api/v1/medications
// @access      Private
exports.getMedications = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.prescriptionId) {
    query = Medication.find({
      prescription: req.params.prescriptionId,
    });
  } else {
    query = Medication.find().populate({
      path: "prescription",
      select: "NbreFoisMed QuanMed FormeMed",
    });
  }

  const medications = await query;

  res.status(200).json({
    success: true,
    count: medications.length,
    data: medications,
  });
});

// @desc        Get single Drug
// @route       GET api/v1/medications/:id
// @access      Private
exports.getDrug = asyncHandler(async (req, res, next) => {
  const drug = await Medication.findById(req.params.id).populate({
    path: "prescription",
    select: "NbreFoisMed QuanMed FormeMed",
  });

  if (!drug) {
    return next(
      new ErrorResponse(`No Drug found with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: drug,
  });
});

// @desc        Add Drug
// @route       POST api/v1/prescriptions/:prescriptionId/medications
// @access      Private
exports.addDrug = asyncHandler(async (req, res, next) => {
  req.body.prescription = req.params.prescriptionId;

  const prescription = await Prescription.findById(req.params.prescriptionId);

  if (!prescription) {
    return next(
      new ErrorResponse(
        `No Prescription found with the id of ${req.params.prescriptionId}`
      ),
      404
    );
  }

  const { CodeMed, NomMed, DosaMed, Presentation } = req.body;

  const medication = await Medication.create({
    CodeMed,
    NomMed,
    DosaMed,
    Presentation,
    prescription,
  });
  res.status(200).json({
    success: true,
    data: medication,
  });
});

// @desc        Update Drug
// @route       PUT api/v1/medications/:id
// @access      Private
exports.updateDrug = asyncHandler(async (req, res, next) => {
  let drug = await Medication.findById(req.params.id);

  if (!drug) {
    return next(
      new ErrorResponse(`No drug found with the id of ${req.params.id}`),
      404
    );
  }

  drug = await Medication.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: drug,
  });
});

// @desc        Delete Drug
// @route       DELETE api/v1/medications/:id
// @access      Private
exports.deleteDrug = asyncHandler(async (req, res, next) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    return next(
      new ErrorResponse(`No Medication found with the id of ${req.params.id}`),
      404
    );
  }

  await medication.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
