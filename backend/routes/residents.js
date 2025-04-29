const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createResident,
    getAllResidents,
    getResidentById,
    updateResident,
    deleteResident,
    getResidentStatistics,
} = require('../controllers/residentController');

// Create resident | POST
router.post('/', protect, createResident);

// Get all residents | GET
router.get('/', getAllResidents);

// Get resident by ID | GET
router.get('/:id', getResidentById);

// Get resident statistics | GET
router.get('/statistics', getResidentStatistics);

// Update resident | PUT
router.put('/:id', protect, updateResident);

// Delete resident | DELETE
router.delete('/:id', protect, deleteResident);

module.exports = router;