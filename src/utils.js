export const levelData = [
    { level: 1, range: 5, difficulty: 'easy' },
    { level: 2, range: 10, difficulty: 'medium' },
    { level: 3, range: 20, difficulty: 'hard' }
];

export const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};
