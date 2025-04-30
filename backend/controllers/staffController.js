const Staff = require('../models/Staff');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

// Create a new staff member | POST
exports.createStaff = async (req, res) => {
    try {
        const {
            staffId,
            fullName,
            position,
            contactNumber,
            email,
            username,
            password
        } = req.body;

        // Validate required fields
        if (!staffId || !fullName || !position || !contactNumber || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Check if staff ID or username already exists
        const existingStaff = await Staff.findOne({
            $or: [
                { staffId },
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingStaff) {
            let error = 'Staff ID or username already exists';
            if (existingStaff.staffId === staffId) error = 'Staff ID already exists';
            if (existingStaff.email === email.toLowerCase()) error = 'Email already exists';
            if (existingStaff.username === username.toLowerCase()) error = 'Username already exists';
        
            return res.status(409).json({
                success: false,
                error
            });
        }

        // Determine if the user is an admin
        const isAdmin = password === config.ADMIN_KEY;

        // Generate QR secret
        const qrSecret = uuidv4();

        // Create new staff member
        const newStaff = await Staff.create({
            staffId,
            fullName,
            position,
            contactNumber,
            email: email.toLowerCase(),
            username,
            password,
            isAdmin,
            qrSecret
        });

        // Exclude password from response
        const staffResponse = newStaff.toObject();
        delete staffResponse.password;
        staffResponse.qrSecret = qrSecret;

        res.status(201).json({
            success: true,
            message: 'Staff member created successfully',
            data: staffResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create staff member',
            message: error.message
        });
    }
};

// Get all staff members | GET
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find()
            .select('-password')
            .sort({ staffId: 1 });

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch staff members',
            message: error.message
        });
    }
};

// Get staff member by ID | GET
exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findOne({ staffId: req.params.id })
            .select('-password');

        if (!staff) {
            return res.status(404).json({
                success: false,
                error: 'Staff member not found'
            });
        }

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch staff member',
            message: error.message
        });
    }
};

// Update staff member | PUT
exports.updateStaff = async (req, res) => {
    try {
        const {
            fullName,
            position,
            contactNumber,
            email,
            username,
            password
        } = req.body;
        const staffId = req.params.id;

        // Find existing staff member
        const existingStaff = await Staff.findOne({ staffId });
        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                error: 'Staff member not found'
            });
        }
        
        // Check email and username uniqueness if they're being updated
        if (email && email.toLowerCase() !== existingStaff.email) {
            const emailExists = await Staff.findOne({ 
                email: email.toLowerCase(),
                staffId: { $ne: staffId }
            });
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already in use'
                });
            }
        }
        if (username && username.toLowerCase() !== existingStaff.username) {
            const usernameExists = await Staff.findOne({
                username: username.toLowerCase(),
                staffId: { $ne: staffId }
            });
            if (usernameExists) {
                return res.status(409).json({
                    success: false,
                    error: 'Username already in use'
                });
            }
        }
        
        // Update fields
        if (fullName) existingStaff.fullName = fullName;
        if (position) existingStaff.position = position;
        if (contactNumber) existingStaff.contactNumber = contactNumber;
        if (email) existingStaff.email = email.toLowerCase();
        if (username) existingStaff.username = username;
        if (password) {
            existingStaff.password = password;
            existingStaff.isAdmin = password === config.ADMIN_KEY;
        }

        // Save updated staff member
        await existingStaff.save();
        
        // Exclude password from response
        const staffResponse = existingStaff.toObject();
        delete staffResponse.password;

        res.status(200).json({
            success: true,
            message: 'Staff member updated successfully',
            data: staffResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update staff member',
            message: error.message
        });
    }
};

// Delete staff member | DELETE
exports.deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        
        // Find and delete staff member
        const staffToDelete = await Staff.findOneAndDelete({ staffId });
        if (!staffToDelete) {
            return res.status(404).json({
                success: false,
                error: 'Staff member not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Staff member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete staff member',
            message: error.message
        });
    }
};