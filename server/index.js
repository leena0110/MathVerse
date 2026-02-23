const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mathverse';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Simple Progress Schema for the existing logic
const simpleProgressSchema = new mongoose.Schema({
    id: { type: String, default: 'global' }, // Using a single global record for simplicity right now
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
    totalTime: { type: Number, default: 0 }
});

const Progress = mongoose.model('ProgressSimple', simpleProgressSchema);

// ─────────────────────────────────────────────
// ROUTE 1: GET /api/progress
// ─────────────────────────────────────────────
app.get('/api/progress', async (req, res) => {
    try {
        let progress = await Progress.findOne({ id: 'global' });
        if (!progress) {
            progress = await Progress.create({ id: 'global' });
        }
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: 'Could not read progress data' });
    }
});

// ─────────────────────────────────────────────
// ROUTE 2: POST /api/progress
// ─────────────────────────────────────────────
app.post('/api/progress', async (req, res) => {
    try {
        await Progress.findOneAndUpdate(
            { id: 'global' },
            { $set: req.body },
            { upsert: true }
        );
        res.json({ message: 'Progress saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Could not save progress data' });
    }
});

// ─────────────────────────────────────────────
// ROUTE 3: GET /api/generate/comparison
// ─────────────────────────────────────────────
app.get('/api/generate/comparison', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';
    const limit = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 10 : Math.min(3 + level, 10);
    let countLeft = Math.floor(Math.random() * limit) + 1;
    let countRight = Math.floor(Math.random() * limit) + 1;
    if (Math.random() > 0.8) countRight = countLeft;
    res.json({ countLeft, countRight });
});

// ─────────────────────────────────────────────
// ROUTE 4: GET /api/generate/addition
// ─────────────────────────────────────────────
app.get('/api/generate/addition', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';
    const maxVal = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 20 : 5 + level * 2;
    let a = Math.floor(Math.random() * maxVal) + 1;
    let b = Math.floor(Math.random() * (maxVal - a)) + 1;
    res.json({ a, b, sum: a + b });
});

// ─────────────────────────────────────────────
// ROUTE 5: GET /api/generate/pattern
// ─────────────────────────────────────────────
app.get('/api/generate/pattern', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';
    const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
    let patternLength = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 6 : Math.min(3 + Math.floor(level / 2), 6);
    const isAABB = Math.random() > 0.5 && patternLength >= 4;
    let base = [shapes[Math.floor(Math.random() * shapes.length)], shapes[Math.floor(Math.random() * shapes.length)]];
    while (base[0] === base[1]) base[1] = shapes[Math.floor(Math.random() * shapes.length)];
    const fullPattern = [];
    for (let i = 0; i < patternLength + 1; i++) fullPattern.push(isAABB ? base[Math.floor(i / 2) % 2] : base[i % 2]);
    const correct = fullPattern.pop();
    const wrongOptions = shapes.filter(s => s !== correct).sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [correct, ...wrongOptions].sort(() => 0.5 - Math.random());
    res.json({ pattern: fullPattern, answer: correct, options });
});

// ─────────────────────────────────────────────
// ROUTE 6: GET /api/generate/sequencing
// ─────────────────────────────────────────────
app.get('/api/generate/sequencing', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';
    let count = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 6 : Math.min(3 + Math.floor(level / 2), 6);
    const start = Math.floor(Math.random() * 20) + 1;
    const step = Math.random() > 0.5 ? 1 : 2;
    const sequence = Array.from({ length: count }, (_, i) => start + i * step);
    const shuffled = [...sequence].sort(() => 0.5 - Math.random());
    res.json({ sequence, shuffled });
});

// ─────────────────────────────────────────────
// ROUTE 7: GET /api/analytics
// ─────────────────────────────────────────────
app.get('/api/analytics', async (req, res) => {
    try {
        const data = await Progress.findOne({ id: 'global' });
        if (!data) return res.json({ games: [], totalCompleted: 0, totalCorrect: 0, overallAccuracy: 0, totalTime: 0 });

        const games = ['quantityComparison', 'numberLineAddition', 'patternRecognition', 'numberSequencing'];
        const analytics = games.map(game => {
            const g = data[game];
            const accuracy = g.completed > 0 ? Math.round((g.correct / g.completed) * 100) : 0;
            return { game, level: g.level, completed: g.completed, correct: g.correct, accuracy };
        });

        const totalCompleted = analytics.reduce((sum, g) => sum + g.completed, 0);
        const totalCorrect = analytics.reduce((sum, g) => sum + g.correct, 0);
        const overallAccuracy = totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0;

        res.json({ games: analytics, totalCompleted, totalCorrect, overallAccuracy, totalTime: data.totalTime });
    } catch (err) {
        res.status(500).json({ error: 'Could not compute analytics' });
    }
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ MathVerse Server running on port ${PORT}`);
});
