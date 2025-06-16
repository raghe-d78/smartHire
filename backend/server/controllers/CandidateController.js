// controllers/CandidateController.js
const User = require('../models/User');
const Candidate = require('../models/CandidateModel');
const cloudinary = require('../utils/cloudinary')

// Get the current authenticated candidate
const getCurrentCandidate = async(req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.user.id })
            .populate('userId', 'name email'); // Only pull name and email from User

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can access this profile' });
        }

        // Merge name/email from user into the candidate response
        const response = {
            ...candidate.toObject(),
            name: candidate.userId.name,
            email: candidate.userId.email
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update the current authenticated candidate
// In CandidateController.js
const updateProfile = async(req, res) => {
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
//upload picture 
const uploadPicture = async(req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
                timestamp: timestamp,
                folder: 'profile_pictures',
                // Add any other required parameters here
                // If using upload presets
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).json({ message: 'Error generating upload signature' });
    }
};
//delete image 
const deletePicture = async(req, res) => {
    try {
        const { publicId } = req.body;
        const result = await cloudinary.uploader.destroy(publicId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
};
//upload cv
const uploadCV = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded or wrong file type" });
        }
        const candidate = await Candidate.findOneAndUpdate({ userId: req.user.id }, { cvUrl: req.file.path }, { new: true });
        res.status(200).json({
            message: "CV uploaded successfully",
            filename: req.file.filename,
            path: req.file.path
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: err.message || "Upload failed" });
    }
};


module.exports = {
    uploadCV,
    getCurrentCandidate,
    updateProfile,
    uploadPicture,
    deletePicture
};