const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema(
  {
    TensionSystolique: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez Une Tension Systolique"],
    },
    TensionDiastolique: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez Une Tension Diastolique"],
    },
    Temperature: {
      type: Number,
      required: [true, "S'il-vous-plait ajoutez Une Tension Diastolique"],
    },
    DiagnoCons: {
      type: String,
      required: [
        true,
        "S'il-vous-plait ajoutez le Diagnostique a cette Consultation",
      ],
    },
    Motif: {
      type: String,
      required: [true, "S'il-vous-plait ajoutez des Motif"],
    },
    CommentaireCons: {
      type: String,
      required: [true, "S'il-vous-plait ajoutez un Commentaire Consultation"],
    },
    sumTarif: {
      type: Number,
      default: 0,
    },
    paid: {
      type: String,
      enum: ["Payé", "Impayé"],
      default: "Impayé",
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    dossier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DossierMedicale",
      required: true,
      unique: false,
    },
    medicalActs: {
      type: Array,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
ConsultationSchema.virtual("prescription", {
  ref: "Prescription",
  localField: "_id",
  foreignField: "consultation",
  justOne: true,
});

// Reverse populate with virtuals
ConsultationSchema.virtual("certificate", {
  ref: "MedicalCertificate",
  localField: "_id",
  foreignField: "consultation",
  justOne: true,
});

module.exports = mongoose.model("Consultation", ConsultationSchema);
