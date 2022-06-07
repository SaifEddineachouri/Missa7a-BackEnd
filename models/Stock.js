const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    NomStock: {
      type: String,
      required: [true, "S'il-vous-plait ajoutez Nom Stock"],
    },
    StatusStock: {
      type: String,
      enum: ["Disponible", "Pas disponible"],
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },
    DateStock: {
      type: Date,
      default: Date.now,
      required: [true, "S'il-vous-plait ajoutez Date Ajout Stock"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
StockSchema.virtual("produits", {
  ref: "StockProduct",
  localField: "_id",
  foreignField: "stock",
  justOne: false,
});

module.exports = mongoose.model("Stock", StockSchema);
