const mongoose = require("mongoose");
Patient = require("./Patient");
const DossierMedicaleSchema = new mongoose.Schema({
  TaillePatient: {
    type: Number,
    required: [true, "Please add a height"],
  },
  PoidsPatient: {
    type: Number,
    required: [true, "Please add a weight"],
  },
  TensionArterielle: {
    type: Number,
    required: [true, "Please add a tension"],
  },
  Temperature: {
    type: Number,
    required: [true, "Please add a temperature"],
  },
  PerimetrePatient: {
    type: Number,
    required: [true, "Please add a width"],
  },
  Antecedents: {
    type: String,
    required: [false],
  },
  AllergiesMedicamenteuses: {
    type: String,
    required: [false],
  },
  MaladiesHereditaires: {
    type: String,
    required: [false],
  },
  AllergiesAlimentaires: {
    type: String,
    required: [false],
  },
  ListeConsultations: {
    type: Array,
    default: [], // ID of consultation
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});
module.exports = mongoose.model("DossierMedicale", DossierMedicaleSchema);
