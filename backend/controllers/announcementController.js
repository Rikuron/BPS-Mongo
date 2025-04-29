const Announcement = require('../models/Announcement');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');
const { trackActivity } = require('./activityController');

// Create a new announcement | POST
exports.createAnnouncement = async (req, res) => {
    try {
        const { 
            announcementId,
            title, 
            description
        } = req.body;
        
        // Validate required fields
        if (!announcementId || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check if announcement already exists
        const existingAnnouncement = await Announcement.findOne({ announcementId });
        if (existingAnnouncement) {
            return res.status(409).json({
                success: false,
                message: 'Announcement already exists',
            });
        }
        
        // Create new announcement
        const announcement = await Announcement.create({
            announcementId,
            title,
            description,
            image: req.file ? req.file.path : '',
            dateTimePosted: new Date()
        });

        // Track activity
        await trackActivity('announcement_create', {
            announcementId: announcement.announcementId,
            announcementTitle: announcement.title,
        });
        
        res.status(201).json({
            success: true,
            message: 'Announcement posted successfully',
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error posting announcement',
            error: error.message,
        });
    }
};

// Get all announcements | GET
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ dateTimePosted: -1 });
    
        res.status(200).json({
            success: true,
            data: announcements,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message,
        });
    }
};

// Get announcement by ID | GET
exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findOne({ announcementId: req.params.id });

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found',
            });
        }
        
        res.status(200).json({
            success: true,
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch announcement',
            message: error.message,
        });
    }
};

// Update announcement | PUT
exports.updateAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;
        const announcementId = req.params.id;

        const announcement = await Announcement.findOne({ announcementId });
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found',
            });
        }
        
        // Update fields
        announcement.title = title || announcement.title;
        announcement.description = description || announcement.description;

        // Update image if provided
        if (req.file) {
            // Delete old image if exists
            if (announcement.image) {
                try {
                    fs.unlinkSync(announcement.image);
                } catch (fileError) {
                    console.warn('Could not delete old image:', fileError.message);
                }
            }
            announcement.image = req.file.path;
        }

        // Save updated announcement
        await announcement.save();

        // Track activity
        await trackActivity('announcement_update', {
            announcementId: announcement.announcementId,
            announcementTitle: announcement.title,
        });

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating announcement',
            error: error.message,
        });
    }
};

// Delete announcement | DELETE
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;

        // Check if announcement exists
        const announcement = await Announcement.findOne({ announcementId });
        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'Announcement not found'
            });
        }

        // Delete image if exists
        if (announcement.image) {
            try {
                fs.unlinkSync(announcement.image);
            } catch (fileError) {
                console.warn('Could not delete image:', fileError.message);
            }
        }

        // Delete announcement
        await Announcement.deleteOne({ announcementId });

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting announcement',
            error: error.message,
        });
    }
};