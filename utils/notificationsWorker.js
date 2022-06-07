("use strict");

const Appointment = require("../models/Appointment");

const notificationWorkerFactory = function () {
  return {
    run: function () {
      Appointment.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
