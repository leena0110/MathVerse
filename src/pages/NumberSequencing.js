import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './GamePage.css';
import './NumberSequencing.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';

const NumberSequencing = () => {
    const navigate = useNavigate();
    const { settings, recordAnswer, updateLevel, addTime } = useProgress();

    const [level, setLevel] = useState(1);
    const [score, setScore] = useState({ current: 2, total: 2 });
    const [targetSequence, setTargetSequence] = useState([]);
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [placedNumbers, setPlacedNumbers] = useState([]); // null or number
    const [feedback, setFeedback] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Sound logic moved inside playSound to prevent errors if files missing
    const playSound = (isCorrect) => {
        if (!settings?.soundEnabled) return;
        try {
            const audio = new Audio(isCorrect ? correctSound : wrongSound);
            audio.play().catch(e => console.error("Audio playback error:", e));
        } catch (error) {
            console.error("Audio initialization error:", error);
        }
    };

    const generateLevel = () => {
        const difficulty = settings?.difficulty || 'adaptive';

        // Sequence length based on difficulty
        let count = 4;
        if (difficulty === 'easy') count = 3;
        else if (difficulty === 'hard') count = 6;
        else count = Math.min(3 + Math.floor(level / 2), 6); // Adaptive scales with level

        const start = Math.floor(Math.random() * 20) + 1;
        // Simple sequential or with steps
        const step = Math.random() > 0.5 ? 1 : 2;
        const seq = Array.from({ length: count }, (_, i) => start + i * step);

        setTargetSequence(seq);

        // Available numbers are shuffled version of sequence
        setAvailableNumbers([...seq].sort(() => 0.5 - Math.random()));

        // Placed numbers slots (all empty initially)
        setPlacedNumbers(Array(count).fill(null));

        setFeedback(null);
        setStartTime(Date.now());
        setTimeElapsed(0);
    };

    useEffect(() => {
        generateLevel();
    }, [level]);

    useEffect(() => {
        let timerInterval;
        if (settings?.showTimer) {
            timerInterval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [settings?.showTimer]);

    const handleDragStart = (e, number) => {
        e.dataTransfer.setData("text/plain", number);
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const number = parseInt(e.dataTransfer.getData("text/plain"));

        // Logic: Move number from available to placed? 
        // Or copy? Screenshot implies moving or selecting. 
        // Let's allow placing into specific slot.
        // If a number is already used in another slot, remove it from there?
        // Simple mode: Items in Available stay until placed. 
        // Actually, typical mechanic: Drag from pool to slot. Item disappears from pool.

        // But let's stick to simple copy for now or standard swapping if easier.
        // Better UX: Drag from Available -> Slot (Removed from Available).
        // Drag from Slot -> Slot (Swap).
        // Drag from Slot -> Available (Return).

        // For now, let's just update the specific slot and not worry about uniqueness enforcement strictly unless user places duplicates (which isn't possible if we consume from pool).
        // To keep it simple like previous code: Just updated slot. 

        const newPlaced = [...placedNumbers];
        newPlaced[index] = number;
        setPlacedNumbers(newPlaced);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const checkAnswer = () => {
        const isCorrect = placedNumbers.every((num, i) => num === targetSequence[i]);

        playSound(isCorrect);
        setFeedback(isCorrect ? 'correct' : 'try-again');

        const timeSpent = (Date.now() - startTime) / 1000;
        addTime(timeSpent);
        recordAnswer('numberSequencing', isCorrect);

        if (isCorrect) {
            if (score.current < 10) setScore(prev => ({ ...prev, current: prev.current + 1 }));
            setTimeout(generateLevel, 1500);
        } else {
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    const resetLevel = () => {
        setPlacedNumbers(Array(targetSequence.length).fill(null));
        setFeedback(null);
    };

    return (
        <div className={`pastel-background game-page ${settings?.theme === 'dark-mode' ? 'dark-mode' : ''}`}>

            {/* Top Navigation - Explicitly positioned */}
            <div className="game-nav-top">
                <button className="nav-button back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <button className="nav-button home-button" onClick={() => navigate('/mathverse')}>
                    🏠 Home
                </button>
            </div>

            <div className="game-content-centered">
                <h1 className="game-title">Number Sequencing</h1>

                {/* Stats Pills */}
                <div className="stats-pills">
                    <span className="pill">Level {level}</span>
                    <span className="pill">Score: {score.current}/{score.total}</span>
                </div>

                <h2 className="instruction-text">Drag numbers to arrange them from smallest to largest</h2>

                {/* White Card Container */}
                <div className="sequence-card">
                    <div className="label-text">Available Numbers:</div>

                    {/* Number Pool */}
                    <div className="number-pool">
                        {availableNumbers.map((num, i) => (
                            <div
                                key={i}
                                className="number-card draggable"
                                draggable
                                onDragStart={(e) => handleDragStart(e, num)}
                            >
                                {num}
                            </div>
                        ))}
                    </div>

                    <div className="label-text">Sorted Order (Drag here):</div>

                    {/* Drop Slots Container - Dashed Blue Box */}
                    <div className="drop-zone-container">
                        <div className="drop-slots-row">
                            {placedNumbers.map((num, i) => (
                                <div
                                    key={i}
                                    className="sequence-slot"
                                    onDrop={(e) => handleDrop(e, i)}
                                    onDragOver={handleDragOver}
                                >
                                    {num !== null ? <span className="dropped-number">{num}</span> : ''}
                                </div>
                            ))}
                        </div>
                        {placedNumbers.every(n => n === null) && (
                            <div className="drop-instruction">Drop numbers here in order</div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons-row">
                        <button className="btn-check-yellow" onClick={checkAnswer}>Check Answer</button>
                        <button className="btn-reset-blue" onClick={resetLevel}>Reset</button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="game-footer-info">
                    Round 3 • Level {level}
                </div>
            </div>

            {/* Bottom Timer Pill */}
            {settings?.showTimer && (
                <div className="timer-pill">
                    ⏱ {timeElapsed}s
                </div>
            )}

            {/* Feedback Overlay */}
            {feedback === 'correct' && (
                <div className="feedback-overlay">
                    <span className="feedback-icon">✓</span>
                    <span className="feedback-text">Well done!</span>
                </div>
            )}
            {feedback === 'try-again' && (
                <div className="feedback-overlay error">
                    <span className="feedback-icon">✗</span>
                    <span className="feedback-text">Try again!</span>
                </div>
            )}
        </div>
    );
};

export default NumberSequencing;
