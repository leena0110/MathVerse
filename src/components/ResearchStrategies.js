import React, { useState } from 'react';
import './ResearchStrategies.css';

/**
 * ResearchStrategies Component
 * 
 * Implements 3 research-backed strategies for autism math learning:
 * 
 * Article 1 (NIH.gov): Positive Reinforcement — Streak-based reward badges
 *   → After 3 correct answers in a row, shows a milestone badge
 * 
 * Article 2 (ED.gov / CRA Method): Scaffolding with Visual Hints
 *   → After a wrong answer, shows a visual counting hint
 * 
 * Article 3 (ResearchGate / Multi-sensory): Encouragement Messages
 *   → Varied, rotating praise messages with visual emphasis
 */

// ─── Strategy 1: Streak Reward Badges (Positive Reinforcement) ───
const REWARD_MILESTONES = [
    { streak: 3, badge: '⭐', message: 'Great Streak!', color: '#f59e0b' },
    { streak: 5, badge: '🌟', message: 'Super Star!', color: '#8b5cf6' },
    { streak: 8, badge: '🏆', message: 'Math Champion!', color: '#ef4444' },
    { streak: 10, badge: '🎓', message: 'Genius Level!', color: '#10b981' },
];

export const StreakReward = ({ streak }) => {
    const milestone = [...REWARD_MILESTONES].reverse().find(m => streak >= m.streak);

    if (!milestone) return null;

    return (
        <div className="streak-reward" style={{ '--reward-color': milestone.color }}>
            <span className="reward-badge">{milestone.badge}</span>
            <span className="reward-message">{milestone.message}</span>
            <span className="reward-streak">{streak} in a row!</span>
        </div>
    );
};

// ─── Strategy 2: Scaffolding Visual Hints ───
export const ScaffoldingHint = ({ gameType, questionData, show }) => {
    if (!show) return null;

    const renderHint = () => {
        switch (gameType) {
            case 'comparison':
                // Show finger counting hint: "Count the left side: 1, 2, 3... Count the right: 1, 2, 3, 4..."
                return (
                    <div className="hint-content">
                        <div className="hint-title">💡 Hint: Try counting!</div>
                        <div className="hint-visual">
                            <span>Left: {questionData?.leftCount && Array.from({ length: questionData.leftCount }, (_, i) => (
                                <span key={i} className="hint-finger">{i + 1}</span>
                            ))}</span>
                            <span>Right: {questionData?.rightCount && Array.from({ length: questionData.rightCount }, (_, i) => (
                                <span key={i} className="hint-finger">{i + 1}</span>
                            ))}</span>
                        </div>
                        <div className="hint-tip">Count each group and compare the numbers!</div>
                    </div>
                );
            case 'addition':
                // Show step-by-step counting: "Start at 3, count 2 more: 4... 5!"
                return (
                    <div className="hint-content">
                        <div className="hint-title">💡 Hint: Count forward!</div>
                        <div className="hint-visual">
                            <span className="hint-start">Start at {questionData?.a}</span>
                            <span className="hint-arrow">→</span>
                            {Array.from({ length: questionData?.b || 0 }, (_, i) => (
                                <span key={i} className="hint-hop">+1</span>
                            ))}
                        </div>
                        <div className="hint-tip">Start at {questionData?.a} and count {questionData?.b} more!</div>
                    </div>
                );
            case 'pattern':
                // Show pattern repetition
                return (
                    <div className="hint-content">
                        <div className="hint-title">💡 Hint: Look at the repeating part!</div>
                        <div className="hint-tip">Look at the first 2 shapes. They keep repeating! What comes next?</div>
                    </div>
                );
            case 'sequencing':
                return (
                    <div className="hint-content">
                        <div className="hint-title">💡 Hint: Find the smallest number first!</div>
                        <div className="hint-tip">Look for the smallest number and place it first, then the next one.</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="scaffolding-hint">
            {renderHint()}
        </div>
    );
};

// ─── Strategy 3: Multi-sensory Encouragement Messages ───
const ENCOURAGEMENT_CORRECT = [
    { text: "Amazing work! 🎉", emphasis: "high" },
    { text: "You're a math star! ⭐", emphasis: "high" },
    { text: "Brilliant thinking! 🧠", emphasis: "medium" },
    { text: "Wonderful job! 🌈", emphasis: "medium" },
    { text: "Keep going, superstar! 🚀", emphasis: "high" },
    { text: "You nailed it! 💪", emphasis: "medium" },
    { text: "Fantastic! 🎊", emphasis: "high" },
    { text: "So smart! 🌟", emphasis: "medium" },
];

const ENCOURAGEMENT_WRONG = [
    { text: "Almost there! Try again 💪", emphasis: "gentle" },
    { text: "Good try! Let's think again 🤔", emphasis: "gentle" },
    { text: "You're learning! One more try 🌱", emphasis: "gentle" },
    { text: "Take your time, you've got this! 🌈", emphasis: "gentle" },
    { text: "It's okay! Mistakes help us learn 📚", emphasis: "gentle" },
];

export const EncouragementMessage = ({ isCorrect, show }) => {
    const [messageIndex] = useState(() =>
        Math.floor(Math.random() * (isCorrect ? ENCOURAGEMENT_CORRECT.length : ENCOURAGEMENT_WRONG.length))
    );

    if (!show) return null;

    const messages = isCorrect ? ENCOURAGEMENT_CORRECT : ENCOURAGEMENT_WRONG;
    const message = messages[messageIndex % messages.length];

    return (
        <div className={`encouragement-message ${message.emphasis} ${isCorrect ? 'correct' : 'wrong'}`}>
            <span className="encouragement-text">{message.text}</span>
        </div>
    );
};

// ─── Utility: get random encouragement text ───
export const getEncouragement = (isCorrect) => {
    const pool = isCorrect ? ENCOURAGEMENT_CORRECT : ENCOURAGEMENT_WRONG;
    return pool[Math.floor(Math.random() * pool.length)].text;
};

const strategies = { StreakReward, ScaffoldingHint, EncouragementMessage, getEncouragement };
export default strategies;
