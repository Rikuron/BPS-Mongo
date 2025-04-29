const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
    residentId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    maritalStatus: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Widowed', 'Separated'],
    },
    occupation: {
        type: String,
        required: true,
    },
}, { 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Resident = mongoose.model('Resident', residentSchema);

module.exports = Resident;