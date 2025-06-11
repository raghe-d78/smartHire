// controllers/CandidateController.js
const User = require('../models/User');
const Candidate = require('../models/Candidate');

// Get candidate by ID
exports.getCandidateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');
        if (!user || user.role !== 'candidate') {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const candidateProfile = await Candidate.findOne({ userId: user._id });
        if (!candidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        res.status(200).json({ user, profile: candidateProfile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update candidate profile
exports.updateCandidateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'candidate') {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const candidate = await Candidate.findOne({ userId: user._id });
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