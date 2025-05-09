const express = require('express');
const router = express.Router();
const { protect , login , refreshToken , validateToken } = require('../middleware/auth');
const { loginWithQr } = require('../controllers/authController');

// Login route
router.post('/login', login);

// Login with QR code route
router.post('/login-qr', loginWithQr);

// Validate token route
router.get('/validate', protect, validateToken);

// Refresh token route
router.post('/refresh', protect, refreshToken);

// Test auth route
router.get('/test', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
            staffId: req.staff.staffId,
            username: req.staff.username,
            isAdmin: req.staff.isAdmin
        }
    });
});

module.exports = router;