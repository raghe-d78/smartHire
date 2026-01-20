const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/Auth');

// Analyze a CV/profile (optionally for a job)
router.post('/analyze-cv', authenticate, aiController.analyzeCV);
// Rank all candidates for a job
router.get('/rank-candidates/:jobId', authenticate, aiController.rankCandidates);
// Get analytics KPIs
router.get('/kpis', authenticate, aiController.getKPIs);

module.exports = router;
