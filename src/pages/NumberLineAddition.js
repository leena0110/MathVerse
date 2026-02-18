import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './GamePage.css';
import './NumberLineAddition.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';

const NumberLineAddition = () => {
    const navigate = useNavigate();
    const { settings, recordAnswer, updateLevel, addTime } = useProgress();

    const [level, setLevel] = useState(1);
    const [question, setQuestion] = useState({ a: 1, b: 2, sum: 3 });
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [currentPos, setCurrentPos] = useState(0);

    const generateQuestion = () => {
        // Difficulty logic
        const maxVal = settings?.difficulty === 'easy' ? 5 : settings?.difficulty === 'hard' ? 20 : 5 + (level * 2);

        let a = Math.floor(Math.random() * maxVal);
        let b = Math.floor(Math.random() * (maxVal - a));

        // Ensure non-zero for better visuals usually
        if (a === 0) a = 1;
        if (b === 0) b = 1;

        setQuestion({ a, b, sum: a + b });
        setCurrentPos(a); // Start hopping from 'a'
        setUserAnswer('');
        setFeedback(null);
        setStartTime(Date.now());
        setTimeElapsed(0);
    };

    useEffect(() => {
        // Initial load or level change
        generateQuestion();
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

    const playSound = (isCorrect) => {
        if (!settings?.soundEnabled) return;

        try {
            const audio = new Audio(isCorrect ? correctSound : wrongSound);
            audio.play().catch(e => console.error("Audio playback error:", e));
        } catch (error) {
            console.error("Audio initialization error:", error);
        }
    };

    const checkAnswer = () => {
        const isCorrect = parseInt(userAnswer) === question.sum;

        playSound(isCorrect);
        setFeedback(isCorrect ? 'correct' : 'try-again');

        const timeSpent = (Date.now() - startTime) / 1000;
        addTime(timeSpent);
        recordAnswer('numberLineAddition', isCorrect);

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Hopping Animation Loop
            let tempPos = question.a;
            const hopInterval = setInterval(() => {
                if (tempPos < question.sum) {
                    tempPos++;
                    setCurrentPos(tempPos);
                } else {
                    clearInterval(hopInterval);
                    // Final navigation/next question logic after animation
                    const shouldLevelUp = newStreak >= 3 && settings?.difficulty === 'adaptive';

                    if (shouldLevelUp) {
                        const newLvl = level + 1;
                        setLevel(newLvl); // This will trigger the generateQuestion via useEffect
                        updateLevel('numberLineAddition', newLvl);
                        setStreak(0);
                    } else {
                        // Only generate here if we DID NOT level up
                        setTimeout(generateQuestion, 1500);
                    }
                }
            }, 300); // 300ms per hop

        } else {
            setStreak(0);
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    // Determine range for number line
    // It should at least cover 0 to sum + padding
    const maxLine = Math.max(question.sum + 2, 5);
    const numberLineRange = Array.from({ length: maxLine + 1 }, (_, i) => i);

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
                <h1 className="game-title">Number Line Addition</h1>

                {/* Stats Pills */}
                <div className="stats-pills">
                    <span className="pill">Level {level}</span>
                    <span className="pill">Streak: {streak} 🔥</span>
                </div>

                <div className="question-display">
                    {question.a} + {question.b} = ?
                </div>

                <div className="number-line-card">
                    <div className="number-line-visual">
                        {numberLineRange.map((num) => {
                            // Determine style for this number point
                            let statusClass = '';
                            if (feedback === 'correct' && num === question.sum) statusClass = 'correct-highlight';
                            else if (num === question.a) statusClass = 'start-point';
                            // In screenshot 1: 0,1,2,3 are shown. 3 is green (target). 1 is yellow (start). 
                            // Let's keep it simple: Start is highlighted, Result is highlighted green on success.

                            // Highlight range? Screenshot 1 shows 0-3 active.
                            // Maybe highlight 0 to sum?
                            const isActive = num <= question.sum;

                            return (
                                <div key={num} className="number-point-wrapper">
                                    <div className="tick-mark"></div>
                                    <div className={`number-box 
                                        ${num === question.sum && feedback === 'correct' && currentPos === question.sum ? 'green-box' : ''} 
                                        ${num === question.a && !feedback ? 'yellow-box' : ''}
                                        ${num === currentPos ? 'current-hop' : ''}
                                        ${num > question.a && num <= currentPos ? 'active-path' : ''}
                                    `}>
                                        {num}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Connecting line is handled via CSS on parent or pseudo elements usually, 
                            but simplified ticks works well too as seen in screenshot */}
                        <div className="line-connector"></div>
                    </div>

                    <div className="instruction-mini">Where did we reach?</div>

                    <div className="input-area">
                        <input
                            type="number"
                            className="answer-input"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                        />
                        <button className="btn-check" onClick={checkAnswer}>
                            {userAnswer ? 'Check' : '?'}
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="game-footer-info">
                    Round 16 • Level {level}
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

export default NumberLineAddition;
