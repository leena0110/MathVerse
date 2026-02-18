import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './GamePage.css';
import './PatternRecognition.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';

const PatternRecognition = () => {
    const navigate = useNavigate();
    const { settings, recordAnswer, updateLevel, addTime } = useProgress();

    const [level, setLevel] = useState(4); // Start level 4 to match screenshot
    const [score, setScore] = useState({ current: 25, total: 40 }); // Mock score
    const [pattern, setPattern] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeElapsed, setTimeElapsed] = useState(0);

    const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

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

    const generatePattern = () => {
        const difficulty = settings?.difficulty || 'adaptive';

        // Pattern length based on difficulty
        let patternLength = 4;
        if (difficulty === 'easy') patternLength = 3;
        else if (difficulty === 'hard') patternLength = 6;
        else patternLength = Math.min(3 + Math.floor(level / 2), 6); // Adaptive scales with level

        // Simple ABAB pattern generator or AABB depending on random
        const isAABB = Math.random() > 0.5 && patternLength >= 4;
        const base = [shapes[Math.floor(Math.random() * shapes.length)], shapes[Math.floor(Math.random() * shapes.length)]];
        while (base[0] === base[1]) {
            base[1] = shapes[Math.floor(Math.random() * shapes.length)];
        }

        const fullPattern = [];
        for (let i = 0; i < patternLength + 1; i++) {
            if (isAABB) {
                fullPattern.push(base[Math.floor(i / 2) % 2]);
            } else {
                fullPattern.push(base[i % 2]);
            }
        }

        const correct = fullPattern.pop(); // The last item is the answer
        setPattern(fullPattern);
        setAnswer(correct);

        // Options: Correct + 2 Wrong
        const wrongOptions = shapes.filter(s => s !== correct).sort(() => 0.5 - Math.random()).slice(0, 2);
        setOptions([correct, ...wrongOptions].sort(() => 0.5 - Math.random()));

        setStartTime(Date.now());
        setFeedback(null);
        setTimeElapsed(0);
    };

    useEffect(() => {
        generatePattern();
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

    const handleChoice = (option) => {
        const isCorrect = option === answer;
        playSound(isCorrect);
        setFeedback(isCorrect ? 'correct' : 'try-again');

        const timeSpent = (Date.now() - startTime) / 1000;
        addTime(timeSpent);
        recordAnswer('patternRecognition', isCorrect);

        if (isCorrect) {
            setScore(prev => ({ ...prev, current: prev.current + 1, total: prev.total + 1 }));
            setTimeout(generatePattern, 1500);
        } else {
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
                <button className="nav-button home-button" onClick={() => navigate('/')}>
                    🏠 Home
                </button>
            </div>

            <div className="game-content-centered">
                <h1 className="game-title">Pattern Recognition</h1>

                {/* Stats Pills */}
                <div className="stats-pills">
                    <span className="pill">Level {level}</span>
                    <span className="pill">Score: {score.current}/{score.total}</span>
                </div>

                <h2 className="instruction-text">What comes next in the pattern?</h2>

                {/* White Card Container */}
                <div className="pattern-card">
                    <div className="pattern-row">
                        {pattern.map((shape, i) => (
                            <div key={i} className="pattern-box blue-border">
                                {shape}
                            </div>
                        ))}
                        <div className="pattern-box dashed-box">?</div>
                    </div>

                    <div className="options-row">
                        {options.map((opt, i) => (
                            <button key={i} className="pattern-option-btn purple-border" onClick={() => handleChoice(opt)} disabled={!!feedback}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

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

                {/* Footer Info */}
                <div className="game-footer-info">
                    Round 41 • Level {level}
                </div>
            </div>

            {/* Bottom Timer Pill */}
            {settings?.showTimer && (
                <div className="timer-pill">
                    ⏱ {timeElapsed}s
                </div>
            )}
        </div>
    );
};

export default PatternRecognition;
