const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
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
  createAt: {
    type: Date,
    default: Date.now,
  },
  medications: {
    type: Array,
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultation",
    required: true,
  },
});

// Cascade delete Medication when Prescription is deleted
PrescriptionSchema.pre("remove", async function (next) {
  await this.model("Medication").deleteMany({ prescription: this._id });
  await this.model("Medication").deleteMany({ prescription: null });
  next();
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
