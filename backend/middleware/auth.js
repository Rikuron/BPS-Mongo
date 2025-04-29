const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const config = require('../config/config');

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token is provided
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token provided'
            });
        }
        
        try {
            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Get staff member from token
            const staff = await Staff.findOne({ staffId: decoded.staffId }).select('-password');
            if (!staff) {
                return res.status(401).json({
                    success: false,
                    error: 'Staff member not found'
                });
            }

            // Attach staff member to request
            req.staff = staff;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, invalid token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to authenticate staff',
            message: error.message
        });
    }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
    if (!req.staff || !req.staff.isAdmin) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden, not authorized'
        });
    }
    next();
};

// Generate JWT token
exports.generateToken = (staffId) => {
    return jwt.sign(
        { staffId }, 
        config.JWT_SECRET, 
        { expiresIn: config.JWT_EXPIRES_IN }
    );
};

// Login Middleware
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }
        
        // Find staff member by username
        const staff = await Staff.findByUsername(username);
        if (!staff) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token
        const token = exports.generateToken(staff.staffId);

        // Remove password from response
        const staffResponse = staff.toObject();
        delete staffResponse.password;

        res.status(200).json({
            success: true,
            token,
            staff: staffResponse
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to login',
            message: error.message
        });
    }
};

// Middleware to refresh token
exports.refreshToken = async (req, res) => {
    try {
        // Get staff from protect middleware
        const staff = req.staff;

        // Generate new token
        const token = exports.generateToken(staff.staffId);

        res.status(200).json({
            success: true,
            token,
            data: staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to refresh token',
            message: error.message
        });
    }
};

// Middleware to validate token
exports.validateToken = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to validate token',
            message: error.message
        });
    }
};