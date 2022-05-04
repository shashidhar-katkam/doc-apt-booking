const baseRouter = require('express').Router();
const patientRouter = require("./patient");
const doctorRouter = require("./doctor");
const appointmentRouter = require("./appointment");


baseRouter.use("/doctor", doctorRouter);
baseRouter.use("/patient", patientRouter);
baseRouter.use("/appointment", appointmentRouter);




module.exports = baseRouter