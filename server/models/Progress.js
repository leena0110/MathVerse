const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantityComparison: {
        level: { type: Number, default: 1 },
        completed: { type: Number, default: 0 },
        correct: { type: Number, default: 0 }
    },
    numberLineAddition: {
        level: { type: Number, default: 1 },
        completed: { type: Number, default: 0 },
        correct: { type: Number, default: 0 }
    },
    patternRecognition: {
        level: { type: Number, default: 1 },
        completed: { type: Number, default: 0 },
        correct: { type: Number, default: 0 }
    },
    numberSequencing: {
        level: { type: Number, default: 1 },
        completed: { type: Number, default: 0 },
        correct: { type: Number, default: 0 }
    },
    settings: {
        soundEnabled: { type: Boolean, default: true },
        animationSpeed: { type: String, default: 'normal' },
        showTimer: { type: Boolean, default: false },
        difficulty: { type: String, default: 'adaptive' },
        theme: { type: String, default: 'pastel' }
    },
    totalTime: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
