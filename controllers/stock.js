const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Stock = require("../models/Stock");
const Categorie = require("../models/CategorieStock");

// @desc        Get All Stock
// @route       GET api/v1/stocks
// @access      Private/Admin,Supplier
exports.getStocks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single Stock
// @route       GET api/v1/stocks/:id
// @access      Private/Admin,Supplier
exports.getStock = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);
  if (!stock) {
    return next(
      new ErrorResponse(`Stock not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: stock,
  });
});

// @desc        Add Stock
// @route       POST api/v1/categories/:CatStockId/stocks
// @access      Private
exports.addStock = asyncHandler(async (req, res, next) => {
  req.body.categorie = req.params.CatStockId;

  const categorie = await Categorie.findById(req.params.CatStockId);

  if (!categorie) {
    return next(
      new ErrorResponse(
        `No Category with the id of ${req.params.CatStockId}`,
        404
      )
    );
  }
  const stock = await Stock.create(req.body);

  res.status(201).json({
    success: true,
    data: stock,
  });
});

// @desc        Update stock
// @route       PUT api/v1/stocks/:id
// @access      Private
exports.updateStock = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!stock) {
    return next(
      new ErrorResponse(`Stock not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: stock });
});

// @desc        Delete stock
// @route       DELETE api/v1/stocks/:id
// @access      Private
exports.deleteStock = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    return next(
      new ErrorResponse(`No Stock found with the id of ${req.params.id}`),
      404
    );
  }

  await stock.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
