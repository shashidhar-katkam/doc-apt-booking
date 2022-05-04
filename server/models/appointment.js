const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Doctor',
        required: [true, 'Appointment is required'],
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingSlot: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true
    },
    statusMessage: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        //  required: true
    },
    review: {
        type: String,
        //  required: true
    },
    prescription: {
        type: String,
        //  required: true
    },

}, {
    timestamps: true
});



module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);