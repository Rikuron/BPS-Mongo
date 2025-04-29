const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createEvent,
    getAllEvents,
    getEventById,
    getUpcomingEvents,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

// Create event | POST
router.post('/', protect, createEvent);

// Get all events | GET
router.get('/', getAllEvents);

// Get event by ID | GET
router.get('/:id', getEventById);

// Get upcoming events | GET
router.get('/upcoming', getUpcomingEvents);

// Update event | PUT
router.put('/:id', protect, updateEvent);

// Delete event | DELETE
router.delete('/:id', protect, deleteEvent);

module.exports = router;