const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
    return jwt.sign({ id }, 'process.env.JWT_SECRET', {
        expiresIn: '365d',
    });
};

const createSendToken = (user, statusCode, res, req) => {
    const token = signToken(user.id);
    let d = new Date();
    d.setFullYear(new Date().getFullYear() + 1);

    res.cookie('jwt', token, {
        expires: d,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
    res.set('SameSite', 'None');
    user.password = undefined;

    return res.status(statusCode).json({
        status: true,
        ll: d,
        token,
        data: user


    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    try {

        let patient = {
            ...req.body,
            patientStatus: 1,
            patientStatusMsg: 'Registered',
            userType: 'patient'
        }

        const newPatient = await Patient.create(patient);
        req.user = newPatient;
        createSendToken(newPatient, 201, res, req);
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
});

exports.login = catchAsync(async (req, res, next) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(200).json({
            status: false,
            message: 'Please provide your Phone Number and Password'
        });
    }

    const user = await Patient.findOne({ phoneNumber }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return res.status(200).json({
            status: false,
            message: 'Incorrect Phone Number and/or Password'
        });
    }
    req.user = user;
    createSendToken(user, 200, res, req);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'hallelujah', {
        expires: new Date(Date.now() + 5),
    });
    return res.status(204).json({
        status: true,
        data: {},
    });
});
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.variable === 'checkIfexist') {
        return next();
    }
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'You are not logged in..Please Log in to continue'
        });
    }

    const decodedToken = await promisify(jwt.verify)(
        token,
        'process.env.JWT_SECRET'
    );
    const currentPatient = await Patient.findById(decodedToken.id);
    if (!currentPatient) {
        if (req.variable === 'checkIfexist') {
            return next();
        }

        return res.status(401).json({
            status: false,
            message: 'Patient belonging to this token no longer exists , please Log in again to continue',
        });

    }
    if (currentPatient.checkIfPasswordChanged(decodedToken.iat)) {
        if (req.variable === 'checkIfexist') {
            return next();
        }
        return res.status(401).json({
            status: false,
            message: 'You have currently changed password..Please log in again to continue',
        });
    }
    req.user = currentPatient;
    if (req.body.type === 'autoLogin') {
        return res.status(200).json({
            status: true,
            data: {
                user: currentPatient,
            },
        });
    }
    next();
});

exports.extractPatient = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    //  else if (req.cookies.jwt) {
    //   token = req.cookies.jwt;
    // }

    if (!token && req.variable === 'checkIfexist') {
        return next();
    }
    if (!token) {
        req.user = null;
        return next();

    }

    const decodedToken = await promisify(jwt.verify)(
        token,
        'process.env.JWT_SECRET'
    );
    const currentPatient = await Patient.findById(decodedToken.id);
    if (!currentPatient) {
        if (req.variable === 'checkIfexist') {
            return next();
        }

        return res.status(401).json({
            status: false,
            message: 'Patient belonging to this token no longer exists , please Log in again to continue',
        });

    }
    if (currentPatient.checkIfPasswordChanged(decodedToken.iat)) {
        if (req.variable === 'checkIfexist') {
            return next();
        }
        return res.status(401).json({
            status: false,
            message: 'You have currently changed password..Please log in again to continue',
        });
    }
    req.user = currentPatient;
    if (req.body.type === 'autoLogin') {
        return res.status(200).json({
            status: true,
            data: {
                user: currentPatient,
            },
        });
    }
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                status: false,
                message: 'You are not permitted to perform this action',
            });
        }
        next();
    };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    const currentPatient = await Patient.findById(req.user.id).select('+password');

    if (!currentPatient) {
        return res.status(401).json({
            status: false,
            message: 'You are not logged in . Please Log in to get access'
        });
    }

    const { currentPassword, passwordNew, passwordConfirmNew } = req.body;

    if (!currentPassword || !passwordNew || !passwordConfirmNew) {
        return res.status(401).json({
            status: false,
            message: 'Please provide your current password , your new password and confirmed new password'
        });
    }


    if (!(await currentPatient.comparePassword(currentPassword, currentPatient.password))) {
        return res.status(401).json({
            status: false,
            message: 'Incorrect password'
        });
    }


    currentPatient.password = passwordNew;
    currentPatient.passwordConfirm = passwordConfirmNew;

    await currentPatient.save();

    createSendToken(currentPatient, 200, res, req);
});



exports.getSession = catchAsync(async (req, res, next) => {
    createSendToken(req.user, 200, res, req);

    // return res.status(200).json({
    //     status: true,
    //     data: req.user
    // });
});