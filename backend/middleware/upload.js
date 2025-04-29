const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = config.UPLOAD.ANNOUNCEMENT_IMAGE_PATH;
        
        // Create upload directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Check if file type is allowed
    if (!config.UPLOAD.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error(
            'Invalid file type. File type must be one of the following: ' 
            + config.UPLOAD.ALLOWED_FILE_TYPES.join(', ')
        ), false);
    }

    cb(null, true);
};

// Initialize multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config.UPLOAD.MAX_FILE_SIZE
    }
});

// Middleware to handle single file upload
exports.uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    error: 'File upload failed',
                    message: err.message
                });
            } else if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'An unexpected error occurred',
                    message: err.message
                });
            }
            next();
        });
    };
};

// Validate file type
exports.isValidFileType = (mimetype) => {
    return config.UPLOAD.ALLOWED_FILE_TYPES.includes(mimetype);
};

// Validate file size
exports.isValidFileSize = (size) => {
    return size <= config.UPLOAD.MAX_FILE_SIZE;
};

// Error handling middleware
exports.handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: 'File upload failed',
            message: err.message
        });
    }
    next(err);
};