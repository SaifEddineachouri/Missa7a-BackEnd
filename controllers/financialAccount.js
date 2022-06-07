const asyncHandler = require("../middleware/async");
const FinancialAccount = require("../models/FinancialAccount");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get All FinancialAccounts
// @route       GET api/v1/accounts
// @access      Private/Admin
exports.getFinancialAccounts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single Financial Account
// @route       GET api/v1/accounts/:id
// @access      Private/Admin
exports.getAccount = asyncHandler(async (req, res, next) => {
  const Account = await FinancialAccount.findById(req.params.id);
  if (!Account) {
    return next(
      new ErrorResponse(`Account not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: Account,
  });
});

// @desc        Create new Financial Account
// @route       POST api/v1/accounts
// @access      Private
exports.createFinancialAccount = asyncHandler(async (req, res, next) => {
  const financialAccount = await FinancialAccount.create(req.body);
  res.status(201).json({ success: true, data: financialAccount });
});

// @desc        Update Financial Account
// @route       PUT api/v1/accounts/:id
// @access      Private
exports.updateFinancialAccount = asyncHandler(async (req, res, next) => {
  const financialAccount = await FinancialAccount.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!financialAccount) {
    return next(
      new ErrorResponse(
        `Financial Account not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: financialAccount });
});

// @desc        Delete Financial Account
// @route       DELETE api/v1/accounts/:id
// @access      Private
exports.deleteFinancialAccount = asyncHandler(async (req, res, next) => {
  const financialAccount = await FinancialAccount.findById(req.params.id);

  if (!financialAccount) {
    return next(
      new ErrorResponse(
        `Financial Account not found with id of ${req.params.id}`,
        404
      )
    );
  }
  financialAccount.remove();

  res.status(200).json({ success: true, data: [] });
});
