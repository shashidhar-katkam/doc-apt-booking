const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        ////    required: true,
        ///  unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please provide a password '],
        minLength: [8, 'password must be greater than 8 characters'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please provide an password confirmed'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords dont match',
        },
    },
    name: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    address: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    patientType: {
        type: Number,
        require: false
    },
    patientStatus: {
        type: Number,
        required: true
    },
    patientStatusMsg: {
        type: String
    },
    reviewerId: {
        type: String
    },
    userType: {
        type: String,
        required: true
    },
    joinedAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
}, {
    timestamps: true
});


patientSchema.pre('save', async function (next) {
    // populating joinedAt as the current date if the created patient is new
    if (this.isNew) this.joinedAt = Date.now();

    // checking if the password was modified or updated
    // if password was not modified , break out of this function and save the patient
    // else continue

    if (!this.isModified('password')) return next();

    // hashing patients Password
    this.password = await bcrypt.hash(this.password, 12);

    // making passwordConfirm undefined so that it doesn't get revealed
    this.passwordConfirm = undefined;

    this.photo = `https://ui-avatars.com/api/?name=${this.name}`;
    return next();
});

// this instance method checks if two passwords match
patientSchema.methods.comparePassword = async function (candidatePass, patientPass) {
    const result = await bcrypt.compare(candidatePass, patientPass);
    return result;
};

// this instance methods checks if password was changed recently compared to the jwt timestamp
patientSchema.methods.checkIfPasswordChanged = function (JWTstamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // return true if password was channged after issueing jwt | else return false
        return JWTstamp < changedTimeStamp;
    }
    return false;
};


module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);