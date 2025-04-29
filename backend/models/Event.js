const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true,
    },
    eventTitle: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Meeting", "Community Event", "Case Proceeding", "Others"],
    }
}, {
    timestamps: true,
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = async function(limit = 3) {
    const currentDate = new Date();
    return this.find({ date: { $gte: currentDate } })
        .sort({ date: 1 })
        .limit(limit);
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;