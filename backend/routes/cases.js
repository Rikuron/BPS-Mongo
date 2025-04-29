const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createCase,
    getAllCases,
    getCaseById,
    updateCase,
    deleteCase,
} = require('../controllers/caseController');

// Create case | POST
router.post('/', protect, createCase);

// Get all cases | GET
router.get('/', getAllCases);

// Get case by ID | GET
router.get('/:id', getCaseById);

// Update case | PUT
router.put('/:id', protect, updateCase);

// Delete case | DELETE
router.delete('/:id', protect, deleteCase);

module.exports = router;