const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  Prenom: {
    type: String,
    required: [true, "Please add a Prenom"],
    maxlength: [20, "Prenom can not be more than 20 characters "],
    minlength: [4, "Prenom can not be less than 4 characters"],
  },
  Nom: {
    type: String,
    required: [true, "Please add a Nom"],
    maxlength: [20, "Nom can not be more than 20 characters "],
    minlength: [4, "Nom can not be less than 4 characters"],
  },
  cin: {
    type: String,
    required: [true, "Please add a National identification number"],
    unique: true,
    maxlength: [
      8,
      "National identification number can not be longer than 8 numbers",
    ],
    minlength: [
      8,
      "National identification number can not be shorter than 8 numbers",
    ],
    match: [/^[01][01][0-9]{6}$/, "Please add a valid CIN number"],
  },
  avatar: {
    type: String,
    required: [true, "Please add a avatar"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["patient", "secretary", "admin", "supplier"],
    default: "patient",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 10,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to  resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire in 10 min
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
