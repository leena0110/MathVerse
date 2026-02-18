const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'progress.json');

// Middleware
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// HELPER: Read / Write progress.json
// ─────────────────────────────────────────────
const readProgress = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeProgress = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

// ─────────────────────────────────────────────
// ROUTE 1: GET /api/progress
// ─────────────────────────────────────────────
app.get('/api/progress', (req, res) => {
    try {
        res.json(readProgress());
    } catch {
        res.status(500).json({ error: 'Could not read progress data' });
    }
});

// ─────────────────────────────────────────────
// ROUTE 2: POST /api/progress
// ─────────────────────────────────────────────
app.post('/api/progress', (req, res) => {
    try {
        writeProgress(req.body);
        res.json({ message: 'Progress saved successfully' });
    } catch {
        res.status(500).json({ error: 'Could not save progress data' });
    }
});

// ─────────────────────────────────────────────
// ROUTE 3: GET /api/generate/comparison
// Generates a Quantity Comparison question
// Query: ?level=1&difficulty=adaptive
// ─────────────────────────────────────────────
app.get('/api/generate/comparison', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';

    const limit = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 10 : Math.min(3 + level, 10);

    let countLeft = Math.floor(Math.random() * limit) + 1;
    let countRight = Math.floor(Math.random() * limit) + 1;

    // ~20% chance of equal quantities
    if (Math.random() > 0.8) countRight = countLeft;

    res.json({ countLeft, countRight });
});

// ─────────────────────────────────────────────
// ROUTE 4: GET /api/generate/addition
// Generates a Number Line Addition question
// Query: ?level=1&difficulty=adaptive
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
// Generates a Pattern Recognition question
// Query: ?level=1&difficulty=adaptive
// ─────────────────────────────────────────────
app.get('/api/generate/pattern', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';

    const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

    let patternLength = 4;
    if (difficulty === 'easy') patternLength = 3;
    else if (difficulty === 'hard') patternLength = 6;
    else patternLength = Math.min(3 + Math.floor(level / 2), 6);

    const isAABB = Math.random() > 0.5 && patternLength >= 4;
    let base = [
        shapes[Math.floor(Math.random() * shapes.length)],
        shapes[Math.floor(Math.random() * shapes.length)]
    ];
    while (base[0] === base[1]) {
        base[1] = shapes[Math.floor(Math.random() * shapes.length)];
    }

    const fullPattern = [];
    for (let i = 0; i < patternLength + 1; i++) {
        fullPattern.push(isAABB ? base[Math.floor(i / 2) % 2] : base[i % 2]);
    }

    const correct = fullPattern.pop();
    const wrongOptions = shapes.filter(s => s !== correct).sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [correct, ...wrongOptions].sort(() => 0.5 - Math.random());

    res.json({ pattern: fullPattern, answer: correct, options });
});

// ─────────────────────────────────────────────
// ROUTE 6: GET /api/generate/sequencing
// Generates a Number Sequencing question
// Query: ?level=1&difficulty=adaptive
// ─────────────────────────────────────────────
app.get('/api/generate/sequencing', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const difficulty = req.query.difficulty || 'adaptive';

    let count = 4;
    if (difficulty === 'easy') count = 3;
    else if (difficulty === 'hard') count = 6;
    else count = Math.min(3 + Math.floor(level / 2), 6);

    const start = Math.floor(Math.random() * 20) + 1;
    const step = Math.random() > 0.5 ? 1 : 2;
    const sequence = Array.from({ length: count }, (_, i) => start + i * step);
    const shuffled = [...sequence].sort(() => 0.5 - Math.random());

    res.json({ sequence, shuffled });
});

// ─────────────────────────────────────────────
// ROUTE 7: GET /api/analytics
// Returns computed analytics from saved progress
// ─────────────────────────────────────────────
app.get('/api/analytics', (req, res) => {
    try {
        const data = readProgress();
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
    } catch {
        res.status(500).json({ error: 'Could not compute analytics' });
    }
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ MathVerse Server running on http://localhost:${PORT}`);
});
