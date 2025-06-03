const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// POST candidate applies for a job
router.post('/', async(req, res) => {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json(newApp);
});

// GET all applications
router.get('/', async(req, res) => {
    const apps = await Application.find()
        .populate('candidateId')
        .populate('jobId');
    res.json(apps);
});

// GET one application
router.get('/:id', async(req, res) => {
    const app = await Application.findById(req.params.id)
        .populate('candidateId')
        .populate('jobId');
    if (!app) return res.status(404).json({ msg: 'Candidature introuvable' });
    res.json(app);
});

// PUT update application (status/score)
router.put('/:id', async(req, res) => {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

module.exports = router;