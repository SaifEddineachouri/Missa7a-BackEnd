const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");
const DossierMedicale = require("../models/Folder");

const PatientSchema = new mongoose.Schema(
  {
    Prenom: {
      type: String,
      required: [true, "Veuillez ajouter un prénom"],
      trim: true,
      maxlength: [20, "Prenom ne peut pas comporter plus de 20 caractères"],
      minlength: [4, "Prenom ne peut pas être inférieur à 4 caractères"],
    },
    Nom: {
      type: String,
      required: [true, "Veuillez ajouter un nom"],
      trim: true,
      maxlength: [20, "Nom ne peut pas comporter plus de 20 caractères"],
      minlength: [5, "Nom ne peut pas être inférieur à 5 caractères"],
    },
    cin: {
      type: String,
      required: false,
      unique: true,
      maxlength: [
        8,
        "Le numéro d'identification national ne peut pas dépasser 8 chiffres",
      ],
      minlength: [
        0,
        "Le numéro d'identification national ne peut pas être inférieur à 8 chiffres",
      ],
      match: [/^[01][01][0-9]{6}$/, "Veuillez ajouter un numéro CIN valide"],
    },
    email: {
      type: String,
      required: true,
    },
    sexe: {
      type: String,
      enum: ["Homme", "Femme"],
    },
    numeroTel: {
      type: String,
      required: [true, "Veuillez ajouter un numéro de téléphone"],
      maxlength: [
        8,
        "Le numéro de téléphone ne peut pas dépasser 8 caractères",
      ],
      minlength: [
        8,
        "Le numéro de téléphone ne peut pas être inférieur à 8 caractères",
      ],
      match: [
        /([ \-_/]*)(\d[ \-_/]*){8}/,
        "Veuillez ajouter un numéro de téléphone valide",
      ],
    },
    DateNaiss: {
      type: Date,
      required: [true, "Veuillez ajouter une date de naissance"],
    },
    Etatcivil: {
      type: String,
      enum: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf"],
    },
    Travail: {
      type: String,
      required: [true, "Veuillez ajouter un emploi"],
    },
    //Rue Jamel Abdennasser 39, Tunis, Tunis 1000, TN
    //Rue Jamel Eddine El Afghani, Tunis, Tunis 1095, TN
    adresse: {
      type: String,
      required: [true, "Veuillez ajouter une adresse"],
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
    hidden: {
      type: Boolean,
      default: false,
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

// Archive Dossier if Patient is hidden
PatientSchema.post("findOneAndUpdate", async (doc) => {
  if (doc.hidden == true) {
    console.log(`Patient ${doc._id} caché. Son dossier sera archivé`);
    await DossierMedicale.findOneAndUpdate(
      { patient: doc._id },
      {
        archived: true,
      }
    ).exec();
  }

  if (doc.hidden == false) {
    console.log(`Patient ${doc._id} caché. Son dossier sera archivé`);
    await DossierMedicale.findOneAndUpdate(
      { patient: doc._id },
      {
        archived: false,
      }
    ).exec();
  }
});

// Reverse populate with virtuals
PatientSchema.virtual("dossier", {
  ref: "DossierMedicale",
  localField: "_id",
  foreignField: "patient",
  justOne: true,
});

// Reverse populate with virtuals
PatientSchema.virtual("appointment", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "patient",
  justOne: false,
});

module.exports = mongoose.model("Patient", PatientSchema);
