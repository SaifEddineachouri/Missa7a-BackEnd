const express = require("express");
const multer = require("multer");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/stockProduct");

const advancedResults = require("../middleware/advancedResults");
const Product = require("../models/StockProduct");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");

    if (isValid) {
      error = null;
    }
    callback(error, "public/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, req.body.NomPrd + Date.now() + "." + ext);
  },
});

router
  .route("/")
  .get(
    protect,
    authorize("admin", "supplier"),
    advancedResults(Product),
    getProducts
  )
  .post(
    multer({ storage: storage }).single("imagePrd"),
    protect,
    authorize("admin", "supplier"),
    createProduct
  );
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
