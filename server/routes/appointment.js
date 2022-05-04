const appointmentRouter = require('express').Router()
const patientController = require('./../controllers/patient');
const doctorController = require('./../controllers/doctor');
const AppointmentController = require('../controllers/appointment')






appointmentRouter.post('/book', patientController.protect, AppointmentController.bookAppointment);



appointmentRouter.post('/patient', patientController.protect, AppointmentController.getMyAppointments);

appointmentRouter.post('/doctor', doctorController.protect, AppointmentController.getDoctorAppoints);


appointmentRouter.post('/update', doctorController.protect, AppointmentController.updateStatus);
appointmentRouter.post('/saverating', patientController.protect, AppointmentController.saveRating);

appointmentRouter.post('/getSlots', patientController.protect, AppointmentController.getAvaliableSlots);

module.exports = appointmentRouter