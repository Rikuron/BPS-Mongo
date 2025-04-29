const Case = require('../models/Case');
const { trackActivity } = require('./activityController');
const config = require('../config/config');

exports.createCase = async (req, res) => {
    try {
        const {
            caseId,
            caseName,
            caseType,
            caseStatus,
            complainantName,
            dateFiled
        } = req.body;

        // Validate required fields
        if (!caseId || !caseName || !caseType || !caseStatus || !complainantName || !dateFiled) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Validate caseType enum
        const validCaseTypes = ['Investigation', 'Violence', 'Others'];
        if (!validCaseTypes.includes(caseType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid case type'
            });
        }

        // Validate caseStatus enum
        const validCaseStatuses = ['Pending', 'Ongoing', 'Resolved'];
        if (!validCaseStatuses.includes(caseStatus)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid case status'
            });
        }

        // Validate dateFiled format
        if (isNaN(new Date(dateFiled).getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format'
            });
        }

        // Check if case already exists
        const existingCase = await Case.findOne({ caseId });
        if (existingCase) {
            return res.status(409).json({
                success: false,
                error: 'Case already exists'
            });
        }

        // Create new case
        const newCase = new Case({
            caseId,
            caseName,
            caseType,
            caseStatus,
            complainantName,
            dateFiled: new Date(dateFiled)
        });

        // Save new case to database
        await newCase.save();
        
        // Track activity
        await trackActivity('case_create', {
            caseId: newCase.caseId,
            caseName: newCase.caseName
        });
        
        res.status(201).json({
            success: true,
            message: 'Case created successfully',
            data: newCase
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create case',
            message: error.message
        });
    }
};

// Get all cases | GET
exports.getAllCases = async (req, res) => {
    try {
        console.log('Fetching cases...');

        const cases = await Case.find()
            .sort({ dateFiled: -1 });

        console.log('Found cases: ', cases.length);

        res.status(200).json({
            success: true,
            data: cases
        });
    } catch (error) {
        console.error('Error in getAllCases: ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cases',
            message: error.message
        });
    }
};

// Get case by ID | GET
exports.getCaseById = async (req, res) => {
    try {
        const caseData = await Case.findOne({ caseId: req.params.id });

        if (!caseData) {
            return res.status(404).json({
                success: false,
                error: 'Case not found'
            });
        }

        res.status(200).json({
            success: true,
            data: caseData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch case',
            message: error.message
        });
    }
};

// Update case | PUT
exports.updateCase = async (req, res) => {
    try {
        const {
            caseName,
            caseType,
            caseStatus,
            complainantName,
            dateFiled
        } = req.body;
        const caseId = req.params.id;

        // Find case by ID
        const caseData = await Case.findOne({ caseId });
        if (!caseData) {
            return res.status(404).json({
                success: false,
                error: 'Case not found'
            });
        }
        
        // Update case fields
        if (caseName) caseData.caseName = caseName;
        if (caseType) caseData.caseType = caseType;
        if (caseStatus) caseData.caseStatus = caseStatus;
        if (complainantName) caseData.complainantName = complainantName;
        if (dateFiled) caseData.dateFiled = new Date(dateFiled);

        // Save updated case
        await caseData.save();

        // Track activity
        await trackActivity('case_update', {
            caseId: caseData.caseId,
            caseName: caseData.caseName
        });

        res.status(200).json({
            success: true,
            message: 'Case updated successfully',
            data: caseData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update case',
            message: error.message
        })
    }
};

// Delete case | DELETE
exports.deleteCase = async (req, res) => {
    try {
        const caseId = req.params.id;

        // Find and delete case
        const caseData = await Case.findOneAndDelete({ caseId });
        if (!caseData) {
            return res.status(404).json({
                success: false,
                error: 'Case not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Case deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete case',
            message: error.message
        });
    }
};