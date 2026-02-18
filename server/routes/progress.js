const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

// @route   GET api/progress
// @desc    Get user progress
router.get('/', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.userId });
        res.json(progress);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   PUT api/progress
// @desc    Update user progress
router.put('/', auth, async (req, res) => {
    try {
        const { quantityComparison, numberLineAddition, patternRecognition, numberSequencing, settings, totalTime } = req.body;

        const progressFields = {};
        if (quantityComparison) progressFields.quantityComparison = quantityComparison;
        if (numberLineAddition) progressFields.numberLineAddition = numberLineAddition;
        if (patternRecognition) progressFields.patternRecognition = patternRecognition;
        if (numberSequencing) progressFields.numberSequencing = numberSequencing;
        if (settings) progressFields.settings = settings;
        if (totalTime !== undefined) progressFields.totalTime = totalTime;
        progressFields.lastActive = Date.now();

        let progress = await Progress.findOneAndUpdate(
            { userId: req.userId },
            { $set: progressFields },
            { new: true, upsert: true }
        );

        res.json(progress);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
