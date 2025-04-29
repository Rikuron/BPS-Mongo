const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["resident_create", "resident_update",
              "announcement_create", "announcement_update",
              "case_create", "case_update",
              "event_create", "event_update"
        ]
    },

    // Fields for activity types
    residentId: String,
    residentName: String,
    announcementId: String,
    announcementTitle: String,
    caseId: String,
    caseName: String,
    eventId: String,
    eventTitle: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Static Method to get recent activities
activitySchema.statics.getRecentActivities = async function(limit = 10) {
    return this.find()
        .sort({ createdAt: -1 })
        .limit(limit)
};

// Static Method to cleanup old activities
activitySchema.statics.cleanupOldActivities = async function(keepCount = 10) {
    const activities = await this.find()
        .sort({ createdAt: -1 })
        .skip(keepCount);

    if (activities.length > 0) {
        const idsToDelete = activities.map(activity => activity._id);
        return this.deleteMany({ _id: { $in: idsToDelete } });
    };
    
    return { deletedCount: 0 };
};

// Post-save hook to cleanup old activities
activitySchema.post('save', async function() {
    await this.constructor.cleanupOldActivities(10);
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;