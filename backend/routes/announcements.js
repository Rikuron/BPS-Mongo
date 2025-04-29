const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} = require('../controllers/announcementController');

// Create announcement | POST
router.post('/', protect, uploadSingle('image'), createAnnouncement);

// Get all announcements | GET
router.get('/', getAllAnnouncements);

// Get announcement by ID | GET
router.get('/:id', getAnnouncementById);

// Update announcement | PUT
router.put('/:id', protect, uploadSingle('image'), updateAnnouncement);

// Delete announcement | DELETE
router.delete('/:id', protect, deleteAnnouncement);

module.exports = router;