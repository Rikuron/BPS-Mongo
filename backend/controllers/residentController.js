const Resident = require('../models/Resident');
const { trackActivity } = require('./activityController');
const config = require('../config/config');

// Create a new resident | POST
exports.createResident = async (req, res) => {
    try {
        const {
            residentId,
            fullName,
            birthdate,
            gender,
            contactNumber,
            address,
            maritalStatus,
            occupation
        } = req.body;

        // Validate required fields
        if (!residentId || !fullName || !birthdate || !gender || !contactNumber || !address || !maritalStatus || !occupation) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Check if resident already exists
        const existingResident = await Resident.findOne({ residentId });
        if (existingResident) {
            return res.status(409).json({
                success: false,
                error: 'Resident ID already exists'
            });
        }

        // Create new resident
        const resident = await Resident.create({
            residentId,
            fullName,
            birthdate,
            gender,
            contactNumber,
            address,
            maritalStatus,
            occupation
        });

        // Track activity
        await trackActivity('resident_create', {
            residentId: resident.residentId,
            residentName: resident.fullName
        });

        res.status(201).json({
            success: true,
            message: 'Resident added successfully',
            data: resident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create resident',
            message: error.message
        });
    }
};

// Get all residents | GET
exports.getAllResidents = async (req, res) => {
    try {
        const residents = await Resident.find()
            .sort({ residentId: 1 });

        res.status(200).json({
            success: true,
            data: residents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch residents',
            message: error.message
        });
    }
};

// Get resident by ID | GET
exports.getResidentById = async (req, res) => {
    try {
        const resident = await Resident.findOne({ residentId: req.params.id });

        if (!resident) {
            return res.status(404).json({
                success: false,
                error: 'Resident not found'
            });
        }

        res.status(200).json({
            success: true,
            data: resident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resident',
            message: error.message
        })
    }
};

// Update resident by ID | PUT
exports.updateResident = async (req, res) => {
    try {
        const {
            fullName,
            birthdate,
            gender,
            contactNumber,
            address,
            maritalStatus,
            occupation
        } = req.body;
        const residentId = req.params.id;

        // Find existing resident
        const resident = await Resident.findOne({ residentId });
        if (!resident) {
            return res.status(404).json({
                success: false,
                error: 'Resident not found'
            });
        }

        // Update resident details
        if (fullName) resident.fullName = fullName;
        if (birthdate) resident.birthdate = birthdate;
        if (gender) resident.gender = gender;
        if (contactNumber) resident.contactNumber = contactNumber;
        if (address) resident.address = address;
        if (maritalStatus) resident.maritalStatus = maritalStatus;
        if (occupation) resident.occupation = occupation;

        // Save updated resident
        await resident.save();

        // Track activity
        await trackActivity('resident_update', {
            residentId: resident.residentId,
            residentName: resident.fullName
        });
        
        res.status(200).json({
            success: true,
            message: 'Resident updated successfully',
            data: resident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update resident',
            message: error.message
        })
    }
};

// Delete resident by ID | DELETE
exports.deleteResident = async (req, res) => {
    try {
        const residentId = req.params.id;

        // Find and delete resident
        const residentToDelete = await Resident.findOneAndDelete({ residentId });
        if (!residentToDelete) {
            return res.status(404).json({
                success: false,
                error: 'Resident not found'
            });
        }

        // Track activity
        await trackActivity('resident_delete', {
            residentId: residentToDelete.residentId,
            residentName: residentToDelete.fullName
        });

        res.status(200).json({
            success: true,
            message: 'Resident deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete resident',
            message: error.message
        })
    }
};

// Get resident statistics
exports.getResidentStatistics = async (req, res) => {
    try {
        const totalResidents = await Resident.countDocuments();
        const currentDate = new Date();

        // Age distribution
        const residents = await Resident.find();
        const ageDistribution = {
            children: 0, // 0 - 12
            youth: 0, // 13 - 17
            adults: 0, // 18 - 59
            seniors: 0 // 60+
        };

        residents.forEach(resident => {
            const age = calculateAge(resident.birthdate);
            if (age >= 0 && age <= 12) ageDistribution.children++;
            else if (age >= 13 && age <= 17) ageDistribution.youth++;
            else if (age >= 18 && age <= 59) ageDistribution.adults++;
            else if (age >= 60) ageDistribution.seniors++;
        });

        // Gender Distribution
        const genderDistribution = await Resident.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        // Marital Status Distribution
        const maritalStatusDistribution = await Resident.aggregate([
            { $group: { _id: '$maritalStatus', count: { $sum: 1 } } }
        ]);

        // Occupation Distribution
        const occupationDistribution = await Resident.aggregate([
            { $group: { _id: '$occupation', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalResidents,
                ageDistribution,
                genderDistribution,
                maritalStatusDistribution,
                occupationDistribution
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resident statistics',
            message: error.message
        });
    }
};

// Helper function to calculate age 
const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};