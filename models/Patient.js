const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a firstName"],
    trim: true,
    maxlength: [20, "firstName can not be more than 20 characters "],
    minlength: [4, "firstName can not be less than 4 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a lastName"],
    trim: true,
    maxlength: [20, "lastName can not be more than 20 characters "],
    minlength: [5, "lastName can not be less than 5 characters"],
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
  },
  gender: {
    type: String,
    enum: ["Homme", "Femme"],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    maxlength: [8, "Phone number can not be longer than 8 characters"],
    minlength: [8, "Phone number can not be shorter than 8 characters"],
    match: [/([ \-_/]*)(\d[ \-_/]*){8}/, "Please add a valid phone number"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please add a Date of Birth"],
  },
  maritalStatus: {
    type: String,
    enum: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf"],
  },
  //Rue Jamel Abdennasser 39, Tunis, Tunis 1000, TN
  //Rue Jamel Eddine El Afghani, Tunis, Tunis 1095, TN
  address: {
    type: String,
    required: [true, "Please add an adress"],
  },
  location: {
    // GeoJSON point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  insuranceName: {
    type: String,
  },
  medicalHistory: {
    type: [String],
    required: true,
    enum: [
      "Anémie",
      "Asthme",
      "Bronchite",
      "Varicelle",
      "Diabète",
      "Pneumonie",
      "Maladie de Thyroïde",
      "Ulcère",
      "autre",
    ],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Geocode & create location field
PatientSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do  not save address in db
  this.address = undefined;
  next();
});
module.exports = mongoose.model("Patient", PatientSchema);
