const Event = require('../models/Event');
const { trackActivity } = require('./activityController');
const config = require('../config/config');

// Create a new event | POST
exports.createEvent = async (req, res) => {
    try {
        const {
            eventId,
            eventTitle,
            location,
            date,
            time,
            category
        } = req.body;

        // Validate required fields
        if (!eventId || !eventTitle || !location || !date || !time || !category) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Check if event already exists
        const existingEvent = await Event.findOne({ eventId });
        if (existingEvent) {
            return res.status(409).json({
                success: false,
                error: 'Event already exists'
            });
        }
       
        // Create new Event
        const newEvent = new Event({
            eventId,
            eventTitle,
            location,
            date: new Date(date),
            time,
            category
        });

        await newEvent.save();

        // Track activity
        await trackActivity('event_create', {
            eventId: newEvent.eventId,
            eventTitle: newEvent.eventTitle
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create event',
            message: error.message
        });
    }
};

// Get all events | GET
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            message: error.message
        });
    }
};

// Get event by ID | GET
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findOne({ eventId: req.params.id });

        if (!eventId) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch event',
            message: error.message
        });
    }
};

// Get upcoming events | GET
exports.getUpcomingEvents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const upcomingEvents = await Event.getUpcomingEvents(limit);

        res.status(200).json({
            success: true,
            data: upcomingEvents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch upcoming events',
            message: error.message
        });
    }
};

// Update event | PUT
exports.updateEvent = async (req, res) => {
    try {
        const {
            eventTitle,
            location,
            date,
            time,
            category
        } = req.body;
        const eventId = req.params.id;

        // Find event by ID
        const event = await Event.findOne({ eventId });
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }
        
        // Update event fields
        if (eventTitle) event.eventTitle = eventTitle;
        if (location) event.location = location;
        if (date) event.date = new Date(date);
        if (time) event.time = time;
        if (category) event.category = category;

        // Save updated event
        await event.save();

        // Track activity 
        await trackActivity('event_update', {
            eventId: event.eventId,
            eventTitle: event.eventTitle,
        });

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update event',
            message: error.message
        });
    }
};

// Delete event | DELETE
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Find and delete event
        const eventData = await Event.findOneAndDelete({ eventId });
        if (!eventData) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete event',
            message: error.message
        });
    }
};