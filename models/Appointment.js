"use strict";

const mongoose = require("mongoose");
const moment = require("moment");
const sendEmail = require("../utils/sendEmail");
const User = require("./User");
const Patient = require("./Patient");

const AppointmentSchema = new mongoose.Schema({
  Subject: {
    type: String,
  },
  Location: {
    type: String,
  },
  StartTime: {
    type: Date,
    index: true,
  },
  EndTime: {
    type: Date,
  },
  IsAllDay: {
    type: Boolean,
  },
  StartTimezone: {
    type: Date,
  },
  EndTimezone: {
    type: Date,
  },
  Description: {
    type: String,
  },
  RecurrenceRule: {
    type: String,
  },
  Id: {
    type: Number,
  },
  notification: {
    type: Number,
    default: 15,
  },
  Guid: {
    type: String,
  },
  Status: {
    type: String,
    enum: ["En Attente", "En Cours", "Suivant", "Terminé", "Absence"],
    required: [true, "Veuillez ajouter un status au rendez-vous"],
    default: "En Attente",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
});

AppointmentSchema.methods.requiresNotification = function (date) {
  return (
    Math.round(
      moment
        .duration(
          moment(this.StartTime)
            .tz("Africa/Tunis")
            .utc()
            .diff(moment(date).utc())
        )
        .asMinutes()
    ) === this.notification
  );
};

AppointmentSchema.statics.sendNotifications = function (callback) {
  // now
  const searchDate = new Date();
  Appointment.find()
    .populate({ path: "patient" })
    .then(function (appointments) {
      appointments = appointments.filter(function (appointment) {
        return appointment.requiresNotification(searchDate);
      });
      if (appointments.length > 0) {
        sendNotifications(appointments);
      }
    });

  /**
   * Send messages to all appoinment owners via Email
   * @param {array} appointments List of appointments.
   */
  function sendNotifications(appointments) {
    appointments.forEach(function (appointment) {
      const message = `À notre fidèle patient \n Missa7a vous rappelle que votre prochain rendez-vous sera sur le : \n ${appointment.StartTime} \n Alors svp venez à l'heure et merci . \n Missa7a vous souhaite une bonne journée`;

      try {
        sendEmail({
          email: appointment.patient.email,
          subject: "MISSA7A : Rappel pour un rendez-vous proche",
          message,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
};

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
