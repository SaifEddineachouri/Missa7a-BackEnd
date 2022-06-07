const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  Prenom: {
    type: String,
    required: [true, "Veuillez ajouter un prénom"],
    maxlength: [20, "Prenom ne peut pas comporter plus de 20 caractères"],
    minlength: [4, "Prenom ne peut pas être inférieur à 4 caractères"],
  },
  Nom: {
    type: String,
    required: [true, "Veuillez ajouter un nom"],
    maxlength: [20, "Le nom ne peut pas comporter plus de 20 caractères"],
    minlength: [4, "Nom ne peut pas être inférieur à 4 caractères"],
  },
  cin: {
    type: String,
    required: [true, "Veuillez ajouter un numéro d'identification national"],
    unique: true,
    maxlength: [
      8,
      "Le numéro d'identification national ne peut pas dépasser 8 chiffres",
    ],
    minlength: [
      8,
      "Le numéro d'identification national ne peut pas être inférieur à 8 chiffres",
    ],
    match: [/^[01][01][0-9]{6}$/, "Veuillez ajouter un numéro CIN valide"],
  },
  avatar: {
    type: String,
    required: [true, "Veuillez ajouter un avatar"],
  },
  email: {
    type: String,
    required: [true, "Veuillez ajouter un e-mail"],
    unique: true,
    match: [
      /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      "Veuillez ajouter un email valide",
    ],
  },
  role: {
    type: String,
    enum: ["patient", "secretary", "admin", "supplier"],
    default: "patient",
  },
  password: {
    type: String,
    required: [true, "Veuillez ajouter un mot de passe"],
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
