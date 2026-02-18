// Central API service - all backend calls go through here
const BASE_URL = 'http://localhost:5000/api';

// ─────────────────────────────────────────────
// Progress
// ─────────────────────────────────────────────
export const fetchProgress = async () => {
    const res = await fetch(`${BASE_URL}/progress`);
    return res.json();
};

export const saveProgress = async (progressData) => {
    await fetch(`${BASE_URL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
    });
};

// ─────────────────────────────────────────────
// Game Question Generators
// ─────────────────────────────────────────────
export const generateComparison = async (level, difficulty) => {
    const res = await fetch(`${BASE_URL}/generate/comparison?level=${level}&difficulty=${difficulty}`);
    return res.json();
};

export const generateAddition = async (level, difficulty) => {
    const res = await fetch(`${BASE_URL}/generate/addition?level=${level}&difficulty=${difficulty}`);
    return res.json();
};

export const generatePattern = async (level, difficulty) => {
    const res = await fetch(`${BASE_URL}/generate/pattern?level=${level}&difficulty=${difficulty}`);
    return res.json();
};

export const generateSequencing = async (level, difficulty) => {
    const res = await fetch(`${BASE_URL}/generate/sequencing?level=${level}&difficulty=${difficulty}`);
    return res.json();
};

// ─────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────
export const fetchAnalytics = async () => {
    const res = await fetch(`${BASE_URL}/analytics`);
    return res.json();
};
