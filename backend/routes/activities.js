const express = require('express');
const router = express.Router();
const { getRecentActivities, cleanupOldActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// Get recent activities
router.get('/recent', protect, getRecentActivities);

// Cleanup old activities
router.delete('/cleanup', protect, cleanupOldActivities);

module.exports = router;