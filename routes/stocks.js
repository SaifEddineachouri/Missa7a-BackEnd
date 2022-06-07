const express = require("express");
const {
  getStocks,
  getStock,
  addStock,
  updateStock,
  deleteStock,
} = require("../controllers/stock");

const advancedResults = require("../middleware/advancedResults");
const Stock = require("../models/Stock");
const productRouter = require("./products");

const router = express.Router({ mergeParams: true });

router.use("/:stockId/products", productRouter);

router
  .route("/")
  .get(advancedResults(Stock, "categorie"), getStocks)
  .post(addStock);
router.route("/:id").get(getStock).put(updateStock).delete(deleteStock);

module.exports = router;
