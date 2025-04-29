const Activity = require('../models/Activity');
const config = require('../config/config');

// Get recent activities
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(config.ACTIVITY_LOG.MAX_LOG_ENTRIES);
    
        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activities',
            error: error.message,
        });
    }
};

// Track a new activity
exports.trackActivity = async (type, details) => {
    try {
        const activity = new Activity({
            type,
            ...details,
        });
        await activity.save();

        // Clean up old activities
        const activityCount = await Activity.countDocuments();
        if (activityCount > config.ACTIVITY_LOG.MAX_LOG_ENTRIES) {
            const oldestActivities = await Activity.find()
                .sort({ createdAt: 1 })
                .limit(activityCount - config.ACTIVITY_LOG.MAX_LOG_ENTRIES);

            for (const activity of oldestActivities) {
                await activity.deleteOne();
            }
        }

        return activity;
    } catch (error) {
        console.error('Error tracking activity:', error);
        return null;
    }
};

// Clean up old activities
exports.cleanupOldActivities = async (req, res) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - config.ACTIVITY_LOG.LOG_RETENTION_DAYS);

        const result = await Activity.deleteMany({ 
            createdAt: { $lt: cutoffDate } 
        });

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} old activities`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to clean up old activities',
            message: error.message,
        });
    }
};