import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('mathVerseProgress');
        return saved ? JSON.parse(saved) : {
            quantityComparison: { level: 1, completed: 0, correct: 0 },
            numberLineAddition: { level: 1, completed: 0, correct: 0 },
            patternRecognition: { level: 1, completed: 0, correct: 0 },
            numberSequencing: { level: 1, completed: 0, correct: 0 },
            totalTime: 0,
            lastActive: new Date().toISOString()
        };
    });

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('mathVerseSettings');
        return saved ? JSON.parse(saved) : {
            soundEnabled: true,
            animationSpeed: 'normal', // slow, normal, fast
            showTimer: false,
            difficulty: 'adaptive', // easy, medium, hard, adaptive
            theme: 'pastel' // pastel, dark-mode
        };
    });

    const [currentSession, setCurrentSession] = useState({
        startTime: null,
        gamesPlayed: 0
    });

    useEffect(() => {
        localStorage.setItem('mathVerseProgress', JSON.stringify(progress));
    }, [progress]);

    useEffect(() => {
        localStorage.setItem('mathVerseSettings', JSON.stringify(settings));
    }, [settings]);

    const updateProgress = (game, isCorrect) => {
        setProgress(prev => {
            const gameProgress = prev[game];
            return {
                ...prev,
                [game]: {
                    ...gameProgress,
                    completed: gameProgress.completed + 1,
                    correct: isCorrect ? gameProgress.correct + 1 : gameProgress.correct
                },
                lastActive: new Date().toISOString()
            };
        });
    };

    const updateLevel = (game, newLevel) => {
        setProgress(prev => ({
            ...prev,
            [game]: {
                ...prev[game],
                level: newLevel
            }
        }));
    };

    const addTime = (seconds) => {
        setProgress(prev => ({
            ...prev,
            totalTime: prev.totalTime + seconds
        }));
    };

    const startSession = () => {
        setCurrentSession({
            startTime: Date.now(),
            gamesPlayed: 0
        });
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    /* Helper for recording an answer: combines updateProgress + logic for adaptive difficulty could go here */
    const recordAnswer = (game, isCorrect) => {
        updateProgress(game, isCorrect);
        // Basic adaptive logic: if difficulty is adaptive, we can auto-level up here
        // But for now, we will let the game component handle valid level-up logic based on streaks
    };

    return (
        <ProgressContext.Provider value={{
            progress,
            settings,
            currentSession,
            updateProgress,
            updateLevel,
            addTime,
            startSession,
            updateSettings,
            recordAnswer
        }}>
            {children}
        </ProgressContext.Provider>
    );
};
