const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const MedicalAct = require("../models/MedicalAct");
const Consultation = require("../models/Consultation");

// @desc        Get Medical Acts
// @route       GET api/v1/acts
// @route       GET api/v1/consultations/:consultationId/Acts
// @access      Private
exports.getActs = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.consultationId) {
    query = MedicalAct.find({
      consultation: req.params.consultationId,
    }).populate({
      path: "consultation",
      select: "CodeCons DiagnoCons Motif",
    });
  } else {
    query = MedicalAct.find({}).populate({
      path: "consultation",
      select: "CodeCons DiagnoCons Motif",
    });
  }

  const Acts = await query;

  res.status(200).json({
    success: true,
    count: Acts.length,
    data: Acts,
  });
});

// @desc        Get single Medical Act
// @route       GET api/v1/acts/:id
// @access      Private
exports.getAct = asyncHandler(async (req, res, next) => {
  const act = await MedicalAct.findById(req.params.id).populate({
    path: "consultation",
    select: "CodeCons DiagnoCons Motif",
  });

  if (!act) {
    return next(
      new ErrorResponse(
        `No Medical Act found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: act,
  });
});

//Extraction chirurgicale dent de sagesse
//détartrage
//Traitement endodontique
//Traitement implantaire phase chirurgicale: pose d implant.

// @desc        Add Medical Act
// @route       POST api/v1/consultations/:consultationId/Acts
// @access      Private
exports.addAct = asyncHandler(async (req, res, next) => {
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
  const act = await MedicalAct.create(req.body);

  res.status(201).json({
    success: true,
    data: act,
  });
});

// @desc        Update Medical Act
// @route       PUT api/v1/Acts/:id
// @access      Private
exports.updateAct = asyncHandler(async (req, res, next) => {
  let act = await MedicalAct.findById(req.params.id);

  if (!act) {
    return next(
      new ErrorResponse(`No Medical Act with the id of ${req.params.id}`, 404)
    );
  }
  act = await MedicalAct.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: act,
  });
});

// @desc        Delete Medical Act
// @route       DELETE api/v1/Acts/:id
// @access      Private
exports.deleteAct = asyncHandler(async (req, res, next) => {
  const act = await MedicalAct.findById(req.params.id);

  if (!act) {
    return next(
      new ErrorResponse(`No Medical Act with the id of ${req.params.id}`, 404)
    );
  }
  await act.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
