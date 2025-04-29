const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    announcementId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: '',
    },
    dateTimePosted: {
        type: Date,
        default: Date.now,
    },
    updateCount: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: false,
});

// Pre-save hook to increment update count
announcementSchema.pre('save', async function(next) {
    if (!this.isNew && this.isModified()) {
        this.updateCount += 1;
        this.updatedAt = new Date();
    }
    next();
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;