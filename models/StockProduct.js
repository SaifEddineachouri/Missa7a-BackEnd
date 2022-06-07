const mongoose = require("mongoose");

const StockProductSchema = new mongoose.Schema({
  NomPrd: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Nom Produit"],
  },
  imagePrd: {
    type: String,
    required: [true, "Veuillez ajouter un Image produit"],
  },
  QuantPrd: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Quantite Produit"],
  },
  DescrPrd: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Description Produit"],
  },
  PrixPrd: {
    type: Number,
    required: [true, "S'il-vous-plait ajoutez Prix Produit"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  ExpDate: {
    type: Date,
    required: [true, "S'il-vous-plait ajoutez Date Expiration Produit"],
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
    unique: false,
  },
});
module.exports = mongoose.model("StockProduct", StockProductSchema);
