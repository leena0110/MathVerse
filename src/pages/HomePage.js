import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './HomePage.css';

// --- IMPORTANT: PLACE YOUR IMAGES IN src/assets AND UPDATE THESE IMPORTS ---
// If your file is a .jpg or .svg, change the extension here.
import logo from '../assets/logo.png';
import startLearningIcon from '../assets/start-learning-icon.png';
import progressIcon from '../assets/progress-icon.png';
import settingsIcon from '../assets/settings-icon.png';
import visualLearningIcon from '../assets/visual-learning-icon.png';
import adaptiveDifficultyIcon from '../assets/adaptive-learning-icon.png';
import calmEnvironmentIcon from '../assets/calm-environment-icon.png';
import progressTrackingIcon from '../assets/progress-tracking-icon.png';
// --------------------------------------------------------------------------

const HomePage = () => {
    const navigate = useNavigate();
    const { startSession } = useProgress();

    useEffect(() => {
        startSession();
    }, []);

    return (
        <div className="pastel-background home-page">
            <div className="content-container">
                {/* Logo and Title */}
                <div className="hero-section">
                    <div className="logo-circle">
                        <img src={logo} alt="MathVerse Logo" className="home-logo-img" />
                    </div>
                    <h1 className="app-title">MathVerse</h1>
                    <p className="app-subtitle">Visual Math Learning for Every Mind</p>
                </div>

                {/* Main Navigation Cards */}
                <div className="main-nav">
                    <div className="nav-card" onClick={() => navigate('/dashboard')}>
                        <div className="nav-icon">
                            <img src={startLearningIcon} alt="Start Learning Icon" className="nav-icon-img" />
                        </div>
                        <h2>Start Learning</h2>
                        <p>Choose your math adventure</p>
                    </div>

                    <div className="nav-card" onClick={() => navigate('/parent-dashboard')}>
                        <div className="nav-icon">
                            <img src={progressIcon} alt="Progress Icon" className="nav-icon-img" />
                        </div>
                        <h2>Progress</h2>
                        <p>Track learning journey</p>
                    </div>

                    <div className="nav-card" onClick={() => navigate('/settings')}>
                        <div className="nav-icon">
                            <img src={settingsIcon} alt="Settings Icon" className="nav-icon-img" />
                        </div>
                        <h2>Settings</h2>
                        <p>Customize experience</p>
                    </div>

                    <div className="nav-card" onClick={() => navigate('/product-info')} style={{ borderColor: '#D4A5FF' }}>
                        <div className="nav-icon">
                            {/* If you have an image for this, uncomment below and import it */}
                            {/* <img src={productDetailsIcon} alt="Product Details" className="nav-icon-img" /> */}
                            <span style={{ fontSize: '3rem' }}>📋</span>
                        </div>
                        <h2>Product Details</h2>
                        <p>Product Info & Student Profile</p>
                    </div>
                </div>

                {/* Features Highlight */}
                <div className="features-section">
                    <h3>Why MathVerse?</h3>
                    <div className="features-grid">
                        <div className="feature-item">
                            <img src={visualLearningIcon} alt="Visual Learning Icon" className="feature-icon-img" />
                            <p>Visual Learning</p>
                        </div>
                        <div className="feature-item">
                            <img src={adaptiveDifficultyIcon} alt="Adaptive Difficulty Icon" className="feature-icon-img" />
                            <p>Adaptive Difficulty</p>
                        </div>
                        <div className="feature-item">
                            <img src={calmEnvironmentIcon} alt="Calm Environment Icon" className="feature-icon-img" />
                            <p>Calm Environment</p>
                        </div>
                        <div className="feature-item">
                            <img src={progressTrackingIcon} alt="Progress Tracking Icon" className="feature-icon-img" />
                            <p>Progress Tracking</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
