// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    cvUrl: String,
    portfolio: String,
    personalityInsights: String,
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    headline: String,
    location: String,
    experience: [{
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    skills: [String],
    about: String,
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    certificates: [{
        title: String,
        issuer: String,
        date: Date,
        link: String
    }]
});

module.exports = mongoose.model('Candidate', candidateSchema);