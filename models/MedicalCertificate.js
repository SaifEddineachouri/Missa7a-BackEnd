const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  NomDocteur: {
    type: String,
    required: [true, "Veuillez ajouter un nom Docteur"],
    trim: true,
    maxlength: [20, "Nom Docteur ne peut pas comporter plus de 20 caractères"],
    minlength: [5, "Nom Docteur ne peut pas être inférieur à 5 caractères"],
  },
  PrenomDocteur: {
    type: String,
    required: [true, "Veuillez ajouter un Prenom Docteur"],
    trim: true,
    maxlength: [
      20,
      "Prenom Docteur ne peut pas comporter plus de 20 caractères",
    ],
    minlength: [5, "Prenom Docteur ne peut pas être inférieur à 5 caractères"],
  },
  NomPatient: {
    type: String,
    required: [true, "Veuillez ajouter un nom Patient"],
    trim: true,
    maxlength: [20, "Nom Patient ne peut pas comporter plus de 20 caractères"],
    minlength: [5, "Nom Patient ne peut pas être inférieur à 5 caractères"],
  },
  PrenomPatient: {
    type: String,
    required: [true, "Veuillez ajouter un Prenom Patient"],
    trim: true,
    maxlength: [
      20,
      "Prenom Patient ne peut pas comporter plus de 20 caractères",
    ],
    minlength: [5, "Prenom Patient ne peut pas être inférieur à 5 caractères"],
  },

  destination: {
    type: String,
    required: [true, "Veuillez ajouter une Destination"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultation",
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model("MedicalCertificate", CertificateSchema);
