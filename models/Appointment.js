const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  Subject: {
    type: String,
  },
  Location: {
    type: String,
  },
  StartTime: {
    type: Date,
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
  Guid: {
    type: String,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
