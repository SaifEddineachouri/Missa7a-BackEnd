const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Categorie = require("../models/CategorieStock");

// @desc        Get All Categories
// @route       GET api/v1/categories
// @access      Private/Admin,Supplier
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single Categorie
// @route       GET api/v1/categories/:id
// @access      Private/Admin,Supplier
exports.getCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await Categorie.findById(req.params.id);
  if (!categorie) {
    return next(
      new ErrorResponse(`Categorie not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: categorie,
  });
});

// @desc        Create new categorie
// @route       POST api/v1/categories
// @access      Private
exports.createCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await Categorie.create(req.body);
  res.status(201).json({ success: true, data: categorie });
});

// @desc        Update categorie
// @route       PUT api/v1/categories/:id
// @access      Private
exports.updateCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!categorie) {
    return next(
      new ErrorResponse(`Categorie not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: categorie });
});

// @desc        Delete categorie
// @route       DELETE api/v1/categories/:id
// @access      Private
exports.deleteCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await Categorie.findById(req.params.id);

  if (!categorie) {
    return next(
      new ErrorResponse(`No Categorie found with the id of ${req.params.id}`),
      404
    );
  }

  await categorie.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
