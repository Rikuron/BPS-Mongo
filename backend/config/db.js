const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI, {
            // MongoDB Connection Options
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Connection Events

        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('MongoDB reconnected');
        });

        // Graceful Shutdown
        process.on('SIGINT', async () => {
            try {
                console.info('MongoDB connection closed due to app termination');
                await mongoose.connection.close();
                process.exit(0);
            } catch (error) {
                console.error('Error closing MongoDB connection: ', err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;