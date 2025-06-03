const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// GET all candidates
router.get('/', async(req, res) => {
    const candidates = await Candidate.find().populate('userId');
    res.json(candidates);
});

// GET one candidate by ID
router.get('/:id', async(req, res) => {
    const candidate = await Candidate.findById(req.params.id).populate('userId');
    if (!candidate) return res.status(404).json({ msg: 'Candidat non trouvé' });
    res.json(candidate);
});

// POST create candidate profile
router.post('/', async(req, res) => {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json(newCandidate);
});

// PUT update candidate
router.put('/:id', async(req, res) => {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE candidate
router.delete('/:id', async(req, res) => {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Supprimé' });
});

module.exports = router;