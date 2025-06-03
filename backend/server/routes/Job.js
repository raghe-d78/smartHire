const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET all jobs
router.get('/', async(req, res) => {
    const jobs = await Job.find().populate('recruiterId');
    res.json(jobs);
});

// GET one job
router.get('/:id', async(req, res) => {
    const job = await Job.findById(req.params.id).populate('recruiterId');
    if (!job) return res.status(404).json({ msg: 'Offre non trouvée' });
    res.json(job);
});

// POST create job
router.post('/', async(req, res) => {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
});

// PUT update job
router.put('/:id', async(req, res) => {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// DELETE job
router.delete('/:id', async(req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Offre supprimée' });
});

module.exports = router;