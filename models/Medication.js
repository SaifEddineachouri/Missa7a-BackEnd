const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema({
  NomMed: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Nom Médicament "],
  },
  FormeMed: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez un Forme Médicament"],
  },
  QuanMed: {
    type: Number,
    required: [true, "S'il-vous-plait ajoutez une Quantite Médicament"],
  },
  DosaMed: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez une Dosa Médicament"],
  },
  NbreFoisMed: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez un Nombre par Fois Médicament"],
  },
  Presentation: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Presentation"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    required: true,
  },
});
module.exports = mongoose.model("Medication", MedicationSchema);
