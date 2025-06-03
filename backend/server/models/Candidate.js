const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cvUrl: {
        type: String
    },
    skills: [String],
    experience: {
        type: String
    },
    portfolio: {
        type: String
    },
    personalityInsights: {
        type: String
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);