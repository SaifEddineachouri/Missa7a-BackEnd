const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const PatientSchema = new mongoose.Schema(
  {
    Prenom: {
      type: String,
      required: [true, "Please add a Prenom"],
      trim: true,
      maxlength: [20, "Prenom can not be more than 20 characters "],
      minlength: [4, "Prenom can not be less than 4 characters"],
    },
    Nom: {
      type: String,
      required: [true, "Please add a Nom"],
      trim: true,
      maxlength: [20, "Nom can not be more than 20 characters "],
      minlength: [5, "Nom can not be less than 5 characters"],
    },
    cin: {
      type: String,
      required: false,
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
    sexe: {
      type: String,
      enum: ["Homme", "Femme"],
    },
    numeroTel: {
      type: String,
      required: [true, "Please add a phone number"],
      maxlength: [8, "Phone number can not be longer than 8 characters"],
      minlength: [8, "Phone number can not be shorter than 8 characters"],
      match: [/([ \-_/]*)(\d[ \-_/]*){8}/, "Please add a valid phone number"],
    },
    DateNaiss: {
      type: Date,
      required: [true, "Please add a Date of Birth"],
    },
    Etatcivil: {
      type: String,
      enum: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf"],
    },
    Travail: {
      type: String,
      required: [true, "Please add a Job"],
    },
    //Rue Jamel Abdennasser 39, Tunis, Tunis 1000, TN
    //Rue Jamel Eddine El Afghani, Tunis, Tunis 1095, TN
    adresse: {
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
    assurance: {
      type: String,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Geocode & create location field
PatientSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.adresse);
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

  // Do not save address in db
  this.adresse = undefined;
  next();
});

// Cascade delete Dossier when a Patient is deleted
PatientSchema.pre("remove", async function (next) {
  console.log(`Dossier médical retiré du patient ${this._id}`);
  await this.model("DossierMedicale").deleteMany({ patient: this._id });
  next();
});

// Reverse populate with  virtuals
PatientSchema.virtual("dossier", {
  ref: "DossierMedicale",
  localField: "_id",
  foreignField: "patient",
  justOne: true,
});
module.exports = mongoose.model("Patient", PatientSchema);
