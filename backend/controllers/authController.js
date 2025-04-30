const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.loginWithQr = async (req, res) => {
    try {
        const { qrSecret } = req.body;
        if(!qrSecret) {
            return res.status(400).json({
                success: false,
                error: 'QR secret is required'
            });
        }

        const staff = await Staff.findOne({ qrSecret });
        if(!staff) {
            return res.status(401).json({
                success: false,
                error: 'Invalid QR secret'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign({ staffId: staff.staffId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

        // Remove password from response
        const staffResponse = staff.toObject();
        delete staffResponse.password;

        res.status(200).json({
            success: true,
            token,
            staff: staffResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Login failed'
        });
    }
};
