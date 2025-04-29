const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true,
        unique: true,
    },
    caseName: {
        type: String,
        required: true,
    },
    caseType: {
        type: String,
        required: true,
        enum: ["Investigation", "Violence", "Others"],
    },
    caseStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Ongoing", "Resolved"],
    },
    complainantName: {
        type: String,
        required: true,
    },
    dateFiled: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;