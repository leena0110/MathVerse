import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './GamePage.css';
import './QuantityComparison.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';

const QuantityComparison = () => {
    const navigate = useNavigate();
    const { settings, recordAnswer, updateLevel, addTime } = useProgress();

    const [level, setLevel] = useState(3); // Set initial level to 3 as per screenshot
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [difficulty, setDifficulty] = useState(settings?.difficulty || 'adaptive');
    const [score, setScore] = useState({ current: 12, total: 15 }); // Set initial score as per screenshot
    const [itemsLeft, setItemsLeft] = useState([]);
    const [itemsRight, setItemsRight] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());

    // Timer state
    const [timer, setTimer] = useState(3);



    const generateQuestion = () => {
        // Difficulty logic
        const maxItems = settings?.difficulty === 'easy' ? 4 : settings?.difficulty === 'hard' ? 10 : 3 + level;

        // Adjust limit based on difficulty to avoid overcrowding while still scaling
        const limit = settings?.difficulty === 'hard' ? 10 : 5;

        // Generate specific scenario closer to screenshot 
        const countLeft = Math.floor(Math.random() * limit) + 1;
        let countRight = Math.floor(Math.random() * limit) + 1;

        // To allow "Same Amount" option occasionally
        if (Math.random() > 0.8) countRight = countLeft;

        setItemsLeft(Array(countLeft).fill('🍎'));
        setItemsRight(Array(countRight).fill('🍎'));
        setFeedback(null);
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
            setFeedback('correct'); // Show "Well Done"
            recordAnswer('quantityComparison', true);
            setScore(prev => ({ ...prev, current: prev.current + 1, total: prev.total + 1 }));
            // Delay next question to allow user to see "Well Done" and hear sound
            setTimeout(() => {
                setFeedback(null);
                generateQuestion();
            }, 1500);
        } else {
            setFeedback('try-again');
            setTimeout(() => setFeedback(null), 1000);
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
                </div>

                <h2 className="instruction-text">Which group has more apples?</h2>

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
