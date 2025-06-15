const express = require('express');
const router = express.Router();
const CandidateController = require('../controllers/CandidateController');
const { authenticate } = require('../middleware/Auth');

// Get candidate profile of the logged-in user
router.get('/profile', authenticate, CandidateController.getCurrentCandidate);



// Update candidate profile by ID
router.put('/profile', authenticate, CandidateController.updateProfile);

router.get('/test', (req, res) => {
    res.json({ message: 'Candidate route test works!' });
});
router.post('/:type-photo', authenticate, (req, res) => {
    CandidateController.updatePhoto(req, res);
});
module.exports = router;