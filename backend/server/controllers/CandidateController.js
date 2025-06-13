// controllers/CandidateController.js
const User = require('../models/User');
const Candidate = require('../models/CandidateModel');

// Get the current authenticated candidate
exports.getCurrentCandidate = async(req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.user.id });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }
        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can access this profile' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update the current authenticated candidate
exports.updateCurrentCandidate = async(req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.user.id });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        const fieldsToUpdate = [
            'headline',
            'location',
            'about',
            'skills',
            'experience',
            'education',
            'certificates',
            'cvUrl',
            'portfolio',
            'personalityInsights'
        ];

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                candidate[field] = req.body[field];
            }
        });

        await candidate.save();
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};