const Activity = require('../models/Activity');

class ActivityTracker {
    static async trackResidentActivity(type, { residentId, residentName }) {
        try {
            const activity = new Activity({
                type,
                residentId,
                residentName
            });
            await activity.save();
            return activity;
        } catch (error) {
            console.error('Error tracking resident activity:', error);
            return null;
        }
    }

    static async trackAnnouncementActivity(type, { announcementId, announcementTitle }) {
        try {
            const activity = new Activity({
                type,
                announcementId,
                announcementTitle,
            });
            await activity.save();
            return activity;
        } catch (error) {
            console.error('Error tracking announcement activity:', error);
            return null;
        }
    }

    static async trackCaseActivity(type, { caseId, caseName }) {
        try {
            const activity = new Activity({
                type,
                caseId,
                caseName,
            });
            await activity.save();
            return activity;
        } catch (error) {
            console.error('Error tracking case activity:', error);
            return null;
        }
    }

    static async trackEventActivity(type, { eventId, eventTitle }) {
        try {
            const activity = new Activity({
                type,
                eventId,
                eventTitle
            });
            await activity.save();
            return activity;
        } catch (error) {
            console.error('Error tracking event activity:', error);
            return null;
        }
    }
};

module.exports = ActivityTracker;