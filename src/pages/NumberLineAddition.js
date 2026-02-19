import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { StreakReward, ScaffoldingHint, getEncouragement } from '../components/ResearchStrategies';
import './GamePage.css';
import './NumberLineAddition.css';
import correctSound from '../assets/correct.mp3';
import wrongSound from '../assets/wrong.mp3';
import { generateAddition } from '../services/api';

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
    const [showHint, setShowHint] = useState(false);
    const [encouragement, setEncouragement] = useState('');

    const generateQuestion = async () => {
        try {
            // 🌐 Fetch from backend server
            const data = await generateAddition(level, settings?.difficulty || 'adaptive');
            setQuestion({ a: data.a, b: data.b, sum: data.sum });
            setCurrentPos(data.a);
        } catch (err) {
            // 🔁 Fallback: generate locally if server is offline
            console.warn('Server offline, using local generation');
            const maxVal = settings?.difficulty === 'easy' ? 5 : settings?.difficulty === 'hard' ? 20 : 5 + level * 2;
            let a = Math.floor(Math.random() * maxVal) + 1;
            let b = Math.floor(Math.random() * (maxVal - a)) + 1;
            setQuestion({ a, b, sum: a + b });
            setCurrentPos(a);
        }
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
        setStartTime(Date.now());
        setTimeElapsed(0);
    };

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setEncouragement(getEncouragement(isCorrect)); // Strategy 3

        const timeSpent = (Date.now() - startTime) / 1000;
        addTime(timeSpent);
        recordAnswer('numberLineAddition', isCorrect);

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setShowHint(false); // Strategy 2: hide hint on correct

            // Hopping Animation Loop
            let tempPos = question.a;
            const hopInterval = setInterval(() => {
                if (tempPos < question.sum) {
                    tempPos++;
                    setCurrentPos(tempPos);
                } else {
                    clearInterval(hopInterval);
                    const shouldLevelUp = newStreak >= 3 && settings?.difficulty === 'adaptive';
                    if (shouldLevelUp) {
                        const newLvl = level + 1;
                        setLevel(newLvl);
                        updateLevel('numberLineAddition', newLvl);
                        setStreak(0);
                    } else {
                        setTimeout(generateQuestion, 1500);
                    }
                }
            }, 300);
        } else {
            setStreak(0);
            setShowHint(true); // Strategy 2: Show scaffolding hint
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
                <button className="nav-button home-button" onClick={() => navigate('/mathverse')}>
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

                {/* Strategy 1: Streak Reward Badge */}
                <StreakReward streak={streak} />

                <div className="question-display">
                    {question.a} + {question.b} = ?
                </div>

                <div className="number-line-card">
                    <div className="number-line-visual">
                        {numberLineRange.map((num) => {
                            // In screenshot 1: 0,1,2,3 are shown. 3 is green (target). 1 is yellow (start). 
                            // Let's keep it simple: Start is highlighted, Result is highlighted green on success.

                            // eslint-disable-next-line no-unused-vars
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

                {/* Strategy 2: Scaffolding Hint after wrong answer */}
                <ScaffoldingHint
                    gameType="addition"
                    questionData={{ a: question.a, b: question.b }}
                    show={showHint}
                />

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
                    <span className="feedback-text">{encouragement}</span>
                </div>
            )}
            {feedback === 'try-again' && (
                <div className="feedback-overlay error">
                    <span className="feedback-icon">✗</span>
                    <span className="feedback-text">{encouragement}</span>
                </div>
            )}
        </div>
    );
};

export default NumberLineAddition;
