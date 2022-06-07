const express = require("express");
const {
  getCategories,
  getCategorie,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} = require("../controllers/stockCategorie");

const advancedResults = require("../middleware/advancedResults");
const CategorieStock = require("../models/CategorieStock");

const stockRouter = require("./stocks");

const router = express.Router({ mergeParams: true });

router.use("/:CatStockId/stocks", stockRouter);

router
  .route("/")
  .get(advancedResults(CategorieStock), getCategories)
  .post(createCategorie);
router
  .route("/:id")
  .get(getCategorie)
  .put(updateCategorie)
  .delete(deleteCategorie);

module.exports = router;
