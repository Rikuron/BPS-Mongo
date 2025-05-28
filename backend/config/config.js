require('dotenv').config();

const config = {
    // Server Config
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    // MongoDB Config
    MONGODB_URI: process.env.MONGODB_URI,

    // JWT Config
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRE,

    // Admin Key
    ADMIN_KEY: process.env.ADMIN_KEY,

    // Email Config
    EMAIL: {
        USER: process.env.EMAIL_USER,
        PASS: process.env.EMAIL_PASS,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    },

    // File Upload Config
    UPLOAD: {
        ANNOUNCEMENT_IMAGE_PATH: process.env.ANNOUNCEMENT_IMAGE_PATH || 'uploads/announcements',
        MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 1024 * 1024 * 5, // 5MB
        ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif']
    },

    // Password Hashing Config
    BCRYPT_SALT_ROUNDS: 10,

    // Pagination Config
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10
    },

    // Activity Log Config
    ACTIVITY_LOG: {
        MAX_LOG_ENTRIES: 10,
        LOG_RETENTION_DAYS: 30
    }
};

module.exports = config;
