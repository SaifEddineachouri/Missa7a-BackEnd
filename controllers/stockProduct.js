const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../models/StockProduct");
const Stock = require("../models/Stock");

// @desc        Get All Products
// @route       GET api/v1/products
// @access      Private/Admin,Supplier
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single Product
// @route       GET api/v1/products/:id
// @access      Private/Admin,Supplier
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc        Create Product
// @route       POST api/v1/stocks/:stockId/products
// @access      Private/Admin,Supplier
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.stock = req.params.stockId;

  const stock = await Stock.findById(req.params.stockId);

  if (!stock) {
    return next(
      new ErrorResponse(`No Stock with the id of ${req.params.stockId}`, 404)
    );
  }

  const url = req.protocol + "://" + req.get("host");

  const { NomPrd, QuantPrd, DescrPrd, PrixPrd, ExpDate } = req.body;

  const product = await Product.create({
    NomPrd,
    QuantPrd,
    DescrPrd,
    imagePrd: url + "/public/images/" + req.file.filename,
    PrixPrd,
    ExpDate,
    stock,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc        Update product
// @route       PUT api/v1/products/:id
// @access      Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: product });
});

// @desc        Delete product
// @route       DELETE api/v1/products/:id
// @access      Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No Product found with the id of ${req.params.id}`),
      404
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});
