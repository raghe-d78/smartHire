// routes/CandidateRoutes.js
const express = require('express');
const router = express.Router();
const CandidateController = require('../controllers/CandidateController');
const { authenticate } = require('../middleware/Auth');

// Get candidate profile by ID
router.get('/profile/:id', authenticate, CandidateController.getCandidateProfile);

// Update candidate profile by ID
router.put('/profile/:id', authenticate, CandidateController.updateCandidateProfile);

module.exports = router;