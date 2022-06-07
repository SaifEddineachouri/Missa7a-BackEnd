const mongoose = require("mongoose");

const MedicalActSchema = new mongoose.Schema({
  NomActe: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez un Nom D'acte"],
  },
  TarifActe: {
    type: Number,
    required: [true, "S'il-vous-plait ajoutez une Tarif"],
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultation",
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get sum Tarif and save
MedicalActSchema.statics.getSumTarifs = async function (consultationId) {
  const obj = await this.aggregate([
    {
      $match: { consultation: consultationId },
    },
    {
      $group: {
        _id: "$consultation",
        sumTarif: { $sum: "$TarifActe" },
      },
    },
  ]);

  try {
    await this.model("Consultation").findByIdAndUpdate(consultationId, {
      sumTarif: Math.ceil(obj[0].sumTarif / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getSumTarifs before save
MedicalActSchema.post("save", function () {
  this.constructor.getSumTarifs(this.consultation);
});

// Call getSumTarifs before remove
MedicalActSchema.pre("remove", function () {
  this.constructor.getSumTarifs(this.consultation);
});

module.exports = mongoose.model("MedicalAct", MedicalActSchema);
