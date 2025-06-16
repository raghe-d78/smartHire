const express = require('express');
const router = express.Router();
const { getCurrentCandidate } = require('../controllers/CandidateController');
const { updateProfile } = require('../controllers/CandidateController');
const Candidate = require('../models/CandidateModel');


const { authenticate } = require('../middleware/Auth');

// Get candidate profile of the logged-in user
router.get('/profile', authenticate, getCurrentCandidate);
//handle profile picture 
router.put('/:id/profile-picture', authenticate, async(req, res) => {
    try {
        const { publicId, url } = req.body;

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id, {
                profilePicture: {
                    publicId,
                    url
                }
            }, { new: true }
        );

        res.json(candidate);
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Error updating profile picture' });
    }
});


// Update candidate profile by ID
router.put('/profile', authenticate, updateProfile);

router.get('/test', (req, res) => {
    res.json({ message: 'Candidate route test works!' });
});



module.exports = router;