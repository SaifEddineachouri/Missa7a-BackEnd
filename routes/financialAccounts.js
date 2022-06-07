const express = require("express");
const {
  getAccount,
  getFinancialAccounts,
  createFinancialAccount,
  updateFinancialAccount,
  deleteFinancialAccount,
} = require("../controllers/financialAccount");
const advancedResults = require("../middleware/advancedResults");
const FinancialAccount = require("../models/FinancialAccount");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(FinancialAccount), getFinancialAccounts)
  .post(createFinancialAccount);
router
  .route("/:id")
  .get(getAccount)
  .put(updateFinancialAccount)
  .delete(deleteFinancialAccount);

module.exports = router;