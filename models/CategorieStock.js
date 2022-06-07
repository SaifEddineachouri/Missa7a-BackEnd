const mongoose = require("mongoose");

const CategorieSchema = new mongoose.Schema({
  NomCategorie: {
    type: String,
    required: [true, "S'il-vous-plait ajoutez Nom Categorie"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Categorie", CategorieSchema);
