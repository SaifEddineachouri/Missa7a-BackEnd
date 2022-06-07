const mongoose = require("mongoose");

const FinancialAccountSchema = new mongoose.Schema({
  CodeComp: {
    type: String,
    required: [true, "Veuillez ajouter un code compte"],
  },
  TypeComp: {
    type: String,
    enum: [
      "Compte épargne",
      "Compte courant ou carte de crédit",
      "Compte espèces",
    ],
    required: [true, "Veuillez ajouter un type du compte"],
  },
  statut: {
    type: String,
    enum: ["Ouvert", "Fermé"],
    required: [true, "Veuillez ajouter statut du compte"],
  },
  InitBalance: {
    type: Number,
    required: [true, "Veuillez ajouter le Balance Initiale du compte"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bankName: {
    type: String,
    required: [false, "Veuillez ajouter un nom de banque"],
  },
  NumComp: {
    type: String,
    required: [false, "Veuillez ajouter un numéro de compte"],
  },
  NumIban: {
    type: String,
    required: [false, "Veuillez ajouter un numéro IBAN"],
    minlength: [24, "Le numéro IBAN ne peut pas être inférieur à 24 chiffres"],
    maxlength: [24, "Le numéro IBAN ne peut pas être supérieur à 24 chiffres"],
  },
  SwiftCode: {
    type: String,
    required: [false, "Veuillez ajouter le Swift Code"],
  },
});

module.exports = mongoose.model("FinancialAccount", FinancialAccountSchema);
