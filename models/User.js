const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a firstName"],
    maxlength: [20, "firstName can not be more than 20 characters "],
    minlength: [4, "firstName can not be less than 4 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a lastName"],
    maxlength: [20, "lastName can not be more than 20 characters "],
    minlength: [4, "lastName can not be less than 4 characters"],
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

module.exports = mongoose.model("User", UserSchema);
