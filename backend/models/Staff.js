const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
      },
      username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      isAdmin: {
        type: Boolean,
        default: false
      }
}, {
    timestamps: true,
});

// Pre-save middleware to hash password
staffSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
staffSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find by username
staffSchema.statics.findByUsername = async function(username) {
    return this.findOne({ username });
};

// Static method to find admins
staffSchema.statics.findAdmins = async function() {
    return this.find({ isAdmin: true });
};

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;