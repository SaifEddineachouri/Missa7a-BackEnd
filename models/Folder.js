const mongoose = require("mongoose");
const Consultation = require("./Consultation");
const DossierMedicaleSchema = new mongoose.Schema(
  {
    TaillePatient: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez hauteur"],
    },
    PoidsPatient: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez poids"],
    },
    PerimetrePatient: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez un largeur"],
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
    archived: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
DossierMedicaleSchema.virtual("consultations", {
  ref: "Consultation",
  localField: "_id",
  foreignField: "dossier",
  justOne: false,
});

module.exports = mongoose.model("DossierMedicale", DossierMedicaleSchema);
