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
// In CandidateController.js
exports.updateProfile = async(req, res) => {
    try {
        const userId = req.user.id; // From authentication middleware
        const updates = req.body;

        // Validate required fields
        if (updates.experience) {
            updates.experience.forEach(exp => {
                if (!exp.title || !exp.company) {
                    return res.status(400).json({
                        message: "Title and company are required for experience entries"
                    });
                }
            });
        }

        // Convert string dates to Date objects
        if (updates.experience) {
            updates.experience = updates.experience.map(exp => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate) : null,
                endDate: exp.endDate ? new Date(exp.endDate) : null
            }));
        }

        // Update candidate
        const updatedCandidate = await Candidate.findOneAndUpdate({ userId }, { $set: updates }, { new: true, runValidators: true });

        if (!updatedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.json(updatedCandidate);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: error.message || "Failed to update profile",
            errors: error.errors
        });
    }
};
// Keep your existing updateProfile controller
exports.updateProfile = async(req, res) => {
    try {
        const updates = req.body;
        const candidate = await Candidate.findOneAndUpdate({ userId: req.user.id }, { $set: updates }, { new: true });
        res.json(candidate);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
};

// Temporary static photo handler
exports.updatePhoto = async(req, res) => {
    // Static placeholder URLs
    const placeholderUrls = {
        profile: "https://via.placeholder.com/300x300.png?text=Profile+Photo",
        cover: "https://via.placeholder.com/1200x300.png?text=Cover+Photo"
    };

    res.json({
        url: placeholderUrls[req.params.type],
        message: "Photo upload will be implemented tomorrow with Cloudinary"
    });
};