import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { StreakReward, ScaffoldingHint, getEncouragement } from '../components/ResearchStrategies';
import './GamePage.css';
import './QuantityComparison.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';
import { generateComparison } from '../services/api';

const QuantityComparison = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const { settings, recordAnswer } = useProgress();

    const [level] = useState(3); // Fixed level 3 for demo
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState({ current: 12, total: 15 });
    const [itemsLeft, setItemsLeft] = useState([]);
    const [itemsRight, setItemsRight] = useState([]);
    const [feedback, setFeedback] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [startTime, setStartTime] = useState(Date.now());
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [encouragement, setEncouragement] = useState('');

    const generateQuestion = async () => {
        try {
            // 🌐 Fetch from backend server
            const data = await generateComparison(level, settings?.difficulty || 'adaptive');
            setItemsLeft(Array(data.countLeft).fill('🍎'));
            setItemsRight(Array(data.countRight).fill('🍎'));
        } catch (err) {
            // 🔁 Fallback: generate locally if server is offline
            console.warn('Server offline, using local generation');
            const limit = settings?.difficulty === 'hard' ? 10 : 5;
            const countLeft = Math.floor(Math.random() * limit) + 1;
            let countRight = Math.floor(Math.random() * limit) + 1;
            if (Math.random() > 0.8) countRight = countLeft;
            setItemsLeft(Array(countLeft).fill('🍎'));
            setItemsRight(Array(countRight).fill('🍎'));
        }
        setFeedback(null);
        setShowHint(false);
        setStartTime(Date.now());
        setTimeElapsed(0);
    };

    useEffect(() => {
        let timerInterval;
        // Only run timer if enabled in settings
        if (settings?.showTimer) {
            timerInterval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [settings?.showTimer]);

    useEffect(() => {
        generateQuestion();
        setTimeElapsed(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const playSound = (isCorrect) => {
        // Log to verify function is triggered
        console.log("Playing sound:", isCorrect ? "correct" : "wrong", "Enabled:", settings?.soundEnabled);

        if (!settings?.soundEnabled) return;

        try {
            // Using imported assets for reliable bundling
            const audio = new Audio(isCorrect ? correctSound : wrongSound);
            audio.play().catch(e => console.error("Audio playback error:", e));
        } catch (error) {
            console.error("Audio initialization error:", error);
        }
    };

    const handleChoice = (choice) => {
        const leftLen = itemsLeft.length;
        const rightLen = itemsRight.length;

        let isCorrect = false;
        if (choice === 'left') isCorrect = leftLen > rightLen;
        if (choice === 'right') isCorrect = rightLen > leftLen;
        if (choice === 'same') isCorrect = leftLen === rightLen;

        playSound(isCorrect);

        if (isCorrect) {
            setFeedback('correct');
            setEncouragement(getEncouragement(true)); // Strategy 3: Varied encouragement
            setShowHint(false);
            const newStreak = streak + 1;
            setStreak(newStreak); // Strategy 1: Track streak
            recordAnswer('quantityComparison', true);
            setScore(prev => ({ ...prev, current: prev.current + 1, total: prev.total + 1 }));
            setTimeout(() => {
                setFeedback(null);
                generateQuestion();
            }, 1800);
        } else {
            setFeedback('try-again');
            setEncouragement(getEncouragement(false)); // Strategy 3: Gentle encouragement
            setStreak(0);
            setShowHint(true); // Strategy 2: Show scaffolding hint
            setTimeout(() => setFeedback(null), 1200);
        }
    };

    return (
        <div className={`pastel-background game-page ${settings?.theme === 'dark-mode' ? 'dark-mode' : ''}`}>

            {/* Top Navigation */}
            <div className="game-nav-top">
                <button className="nav-button back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <button className="nav-button home-button" onClick={() => navigate('/mathverse')}>
                    🏠 Home
                </button>
            </div>

            <div className="game-content-centered">
                <h1 className="game-title">Quantity Comparison</h1>

                {/* Stats Pills */}
                <div className="stats-pills">
                    <span className="pill">Level {level}</span>
                    <span className="pill">Score: {score.current}/{score.total}</span>
                    {streak > 0 && <span className="pill">🔥 {streak}</span>}
                </div>

                {/* Strategy 1: Streak Reward Badge (Positive Reinforcement) */}
                <StreakReward streak={streak} />

                <h2 className="instruction-text">Which group has more apples?</h2>

                {/* Feedback Overlay — Strategy 3: Multi-sensory encouragement */}
                {feedback === 'correct' && (
                    <div className="feedback-overlay">
                        <span className="feedback-icon">✓</span>
                        <span className="feedback-text">{encouragement}</span>
                    </div>
                )}
                {feedback === 'try-again' && (
                    <div className="feedback-overlay error">
                        <span className="feedback-icon">✗</span>
                        <span className="feedback-text">{encouragement}</span>
                    </div>
                )}

                {/* Strategy 2: Scaffolding Hint (Visual counting aid after wrong answer) */}
                <ScaffoldingHint
                    gameType="comparison"
                    questionData={{ leftCount: itemsLeft.length, rightCount: itemsRight.length }}
                    show={showHint}
                />

                <div className="comparison-container">
                    {/* Left Group */}
                    <div className={`object-group ${feedback === 'correct' && itemsLeft.length > itemsRight.length ? 'winner' : ''}`}>
                        {itemsLeft.map((item, i) => (
                            <span key={`l-${i}`} className="object">{item}</span>
                        ))}
                    </div>

                    <div className="vs-circle">VS</div>

                    {/* Right Group */}
                    <div className={`object-group ${feedback === 'correct' && itemsRight.length > itemsLeft.length ? 'winner' : ''}`}>
                        {itemsRight.map((item, i) => (
                            <span key={`r-${i}`} className="object">{item}</span>
                        ))}
                    </div>
                </div>

                {/* Answer Buttons */}
                <div className="answer-buttons">
                    <button className="game-btn btn-yellow" onClick={() => handleChoice('left')}>
                        Left has More
                    </button>
                    <button className="game-btn btn-blue" onClick={() => handleChoice('right')}>
                        Right has More
                    </button>
                    <button className="game-btn btn-orange" onClick={() => handleChoice('same')}>
                        Same Amount
                    </button>
                </div>

                {/* Footer Info */}
                <div className="game-footer-info">
                    Round 16 • Level {level}
                </div>
            </div>

            {/* Bottom Timer Pill - Only show if setting is enabled */}
            {settings?.showTimer && (
                <div className="timer-pill">
                    ⏱ {timeElapsed}s
                </div>
            )}

        </div>
    );
};

export default QuantityComparison;
