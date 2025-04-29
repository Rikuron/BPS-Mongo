const express = require('express');
const router = express.Router();
const { protect , isAdmin } = require('../middleware/auth');
const {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff
} = require('../controllers/staffController');

// Create staff | POST
router.post('/', protect, isAdmin, createStaff);

// Get all staff | GET
router.get('/', protect, getAllStaff);

// Get staff by ID | GET
router.get('/:id', protect, getStaffById);

// Update staff | PUT
router.put('/:id', protect, isAdmin, updateStaff);

// Delete staff | DELETE
router.delete('/:id', protect, isAdmin, deleteStaff);

module.exports = router;