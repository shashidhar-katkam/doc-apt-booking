
const Appointment = require('../models/appointment');
const catchAsync = require('../utils/catchAsync');
const { BookingSlots } = require('../utils/constants');
const APIFeatures = require('./../utils/apiFeature');
const _ = require('lodash');
exports.bookAppointment = catchAsync(async (req, res, next) => {
    try {

        let body = req.body;

        body.patient = req.user._id;
        body.status = 1;
        body.statusMessage = 'Booked';

        const newAppointment = await Appointment.create(body);
        return res.status(200).json({
            status: true,
            message: 'Appointment Successfully Booked.',
            data: newAppointment
        });

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});


exports.getMyAppointments = catchAsync(async (req, res, next) => {
    try {
        let filter = {
            patient: req.user._id,
            status: req.body.status
        }

        let queryParams = req.query;

        if (queryParams.search && queryParams.search != '') {
            filter = {
                ...filter,

                "description": {
                    $regex: queryParams.search || '',
                    $options: 'i',
                }

            }
        }

        const features = new APIFeatures(Appointment.find(filter), queryParams)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .populate('doctor')
            .lean();
        let appointments = await features.query;

        let totalAppointments = await Appointment.countDocuments(filter);
        return res.status(200).json({
            status: true,
            message: 'Appointments successfully fetched.',
            totalRecords: totalAppointments,
            data: appointments
        });


        // return res.status(200).json({
        //     user: req.user
        // });


    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});


exports.getAvaliableSlots = catchAsync(async (req, res, next) => {
    try {

        if (!req.body.doctor && !req.body.date) {
            throw new Error('Body is empty.')
        }



        let filter = {
            doctor: req.body.doctor,
            bookingDate: req.body.date
        }

        console.log(filter)

        let queryParams = req.query;

        const features = new APIFeatures(Appointment.find(filter), queryParams)
            .filter()
            .lean();
        let appointments = await features.query;

        let slots = _.cloneDeep(BookingSlots)
        let avaliableSlots = slots.map((slot) => {
            let isBooked = appointments.find((s) => s.bookingSlot == slot.value);
            if (isBooked) {
                slot.booked = true;
            }


            return slot;
        });





        return res.status(200).json({
            status: true,
            message: 'Slots fetched successfully.',
            data: avaliableSlots
        });


    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

exports.getDoctorAppoints = catchAsync(async (req, res, next) => {
    try {

        let reqBody = req.body;
        let filter = {
            doctor: req.user._id,
            bookingDate: reqBody.bookingDate,
            status: reqBody.status
        }

        let queryParams = req.query;

        const features = new APIFeatures(Appointment.find(filter), queryParams)
            .filter()
            .sort()
            .limitFields()
            .populate('patient')
            .paginate()
            .lean();
        let appointments = await features.query;

        let totalAppointments = await Appointment.countDocuments(filter);
        return res.status(200).json({
            status: true,
            message: 'Appointments successfully fetched.',
            totalRecords: totalAppointments,
            data: appointments
        });


    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    try {

        let appointment = req.body;

        let appointmentData = await Appointment.findById(appointment._id).lean();
        appointmentData = JSON.parse(JSON.stringify(appointmentData, null, '\t'))

        if (appointmentData.doctor == req.user._id) {
            await Appointment.findByIdAndUpdate(appointment._id, {
                status: appointment.status,
                statusMessage: appointment.statusMessage,
                prescription: appointment.prescription


            })
            return res.status(200).json({
                status: true,
                message: 'Status updated ',
            });
        } else {
            throw new Error(`You don't have permission to do this operation.`)
        }
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});

exports.saveRating = catchAsync(async (req, res, next) => {
    try {

        let appointment = req.body;

        let appointmentData = await Appointment.findById(appointment._id).lean();
        appointmentData = JSON.parse(JSON.stringify(appointmentData, null, '\t'))

        if (appointmentData.patient == req.user._id) {
            await Appointment.findByIdAndUpdate(appointment._id, { rating: appointment.rating, review: appointment.review })
            return res.status(200).json({
                status: true,
                message: 'Status updated ',
            });
        } else {
            throw new Error(`You don't have permission to do this operation.`)
        }
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});