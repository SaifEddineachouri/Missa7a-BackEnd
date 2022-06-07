const mongoose = require("mongoose");

const AppointmentRequestSchema = new mongoose.Schema({
  Subject: {
    type: String,
  },
  status: {
    type: String,
    enum: ["En Attente", "Confirmé", "Pas confirmé"],
    required: [true, "Veuillez ajouter status au demande"],
    default: "En Attente",
  },
  StartTime: {
    type: Date,
  },
  EndTime: {
    type: Date,
  },
  Description: {
    type: String,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to add 1Hour and save
AppointmentRequestSchema.statics.addHour = async function () {
  const obj = await this.aggregate([
    {
      $project: {
        EndTime: {
          $dateAdd: {
            startDate: "$StartTime",
            unit: "hour",
            amount: 1,
          },
        },
      },
    },
    {
      $merge: "appointmentrequests",
    },
  ]);
};

// Call getSumTarifs before save
AppointmentRequestSchema.post("save", function () {
  this.constructor.addHour();
});

module.exports = mongoose.model("AppointmentRequest", AppointmentRequestSchema);
