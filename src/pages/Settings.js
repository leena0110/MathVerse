import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const { settings = {}, updateSettings } = useProgress();

    // Safety check for settings object properties
    const safeSettings = {
        theme: settings.theme || 'pastel',
        difficulty: settings.difficulty || 'adaptive',
        soundEnabled: settings.soundEnabled ?? true,
        showTimer: settings.showTimer ?? false,
        animationSpeed: settings.animationSpeed || 'normal'
    };

    const handleToggle = (key) => {
        updateSettings({ [key]: !safeSettings[key] });
    };

    const handleSelect = (key, value) => {
        updateSettings({ [key]: value });
    };

    return (
        <div className={`pastel-background settings-page ${safeSettings.theme === 'dark-mode' ? 'dark-mode' : ''}`}>

            {/* Top Navigation */}
            <div className="game-nav-top">
                <button className="nav-button back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <button className="nav-button home-button" onClick={() => navigate('/')}>
                    🏠 Home
                </button>
            </div>

            <div className="settings-content-centered">

                {/* Audio Section */}
                <div className="setting-card">
                    <h2 className="section-title">Audio</h2>
                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Sound Effects</span>
                            <span className="setting-desc">Enable audio feedback for actions</span>
                        </div>
                        <button
                            className={`toggle-switch ${safeSettings.soundEnabled ? 'on' : 'off'}`}
                            onClick={() => handleToggle('soundEnabled')}
                        >
                            {safeSettings.soundEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {/* Visual Experience Section */}
                <div className="setting-card">
                    <h2 className="section-title">Visual Experience</h2>
                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Animation Speed</span>
                            <span className="setting-desc">Control how fast animations play</span>
                        </div>
                        <div className="options-group">
                            {['slow', 'normal', 'fast'].map((speed) => (
                                <button
                                    key={speed}
                                    className={`option-pill ${safeSettings.animationSpeed === speed ? 'selected' : ''}`}
                                    onClick={() => handleSelect('animationSpeed', speed)}
                                >
                                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gameplay Section */}
                <div className="setting-card">
                    <h2 className="section-title">Gameplay</h2>
                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Show Timer</span>
                            <span className="setting-desc">Display time spent on each question</span>
                        </div>
                        <button
                            className={`toggle-switch ${safeSettings.showTimer ? 'on' : 'off'}`}
                            onClick={() => handleToggle('showTimer')}
                        >
                            {safeSettings.showTimer ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {/* Difficulty Section */}
                <div className="setting-card">
                    <h2 className="section-title">Difficulty</h2>
                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Difficulty Mode</span>
                            <span className="setting-desc">Choose how the difficulty adjusts</span>
                        </div>
                        <div className="options-group">
                            {['easy', 'adaptive', 'hard'].map((mode) => (
                                <button
                                    key={mode}
                                    className={`option-pill ${safeSettings.difficulty === mode ? 'selected' : ''}`}
                                    onClick={() => handleSelect('difficulty', mode)}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="setting-card">
                    <h2 className="section-title">Appearance</h2>
                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Color Theme</span>
                            <span className="setting-desc">Choose your preferred visual theme</span>
                        </div>
                        <div className="options-group">
                            <button
                                className={`option-pill ${safeSettings.theme === 'pastel' ? 'selected' : ''}`}
                                onClick={() => handleSelect('theme', 'pastel')}
                            >
                                Pastel
                            </button>
                            <button
                                className={`option-pill ${safeSettings.theme === 'dark-mode' ? 'selected' : ''}`}
                                onClick={() => handleSelect('theme', 'dark-mode')}
                            >
                                Dark Mode
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
