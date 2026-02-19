import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

// Logos
import calmSenseLogo from '../assets/CalmSenselogo.png';
import mathVerseLogo from '../assets/logo.png';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="pastel-background welcome-page">
            <div className="content-container">

                {/* --- HEADER --- */}
                <div className="portfolio-header">
                    <h1 className="portfolio-title">Digital Support for Neurodiverse Minds</h1>
                    <p className="portfolio-subtitle">
                        We develop specialized digital environments designed for children with Autism Spectrum Disorder (ASD).
                        By combining sensory regulation with interactive visual learning, we create a
                        continuum of support from emotional stability to academic excellence.
                    </p>
                </div>

                <div className="section-divider"></div>

                <h2 className="section-title-centered">Empowering Every Mind</h2>
                <div className="autism-grid">
                    <div className="autism-card">
                        <h3>Sensory First</h3>
                        <p>Minimizing sensory overload through pastel palettes and gentle interactions.</p>
                    </div>
                    <div className="autism-card">
                        <h3>Cognitive Load</h3>
                        <p>Reducing anxiety by using visual representations instead of abstract numbers.</p>
                    </div>
                    <div className="autism-card">
                        <h3>Independence</h3>
                        <p>Building self-regulation and confidence through adaptive, fail-safe loops.</p>
                    </div>
                </div>

                {/* --- CARDS GRID --- */}
                <div className="labs-grid-3-col">

                    {/* CARD 1: CALM SENSE */}
                    <div className="lab-card">
                        <div className="lab-logo-container">
                            <img src={calmSenseLogo} alt="CalmSense" className="lab-logo-img" />
                        </div>
                        <div className="lab-body">
                            <span className="lab-subtitle">LAB 1: SENSORY REGULATION</span>
                            <h3>CalmSense</h3>
                            <p className="lab-description">
                                A digital sensory regulation app for managing emotions and practicing calming techniques.
                            </p>

                            <div className="feature-badges">
                                <span>Breathing</span>
                                <span>Sensory Tools</span>
                                <span>Emotion Log</span>
                            </div>

                            <a href="https://calm-sense-modified-gfuo5fbp3-leena0110s-projects.vercel.app"
                                target="_blank" rel="noreferrer" className="lab-btn lab-1-btn">
                                Open CalmSense →
                            </a>
                        </div>
                    </div>

                    {/* CARD 2: MATH VERSE */}
                    <div className="lab-card">
                        <div className="lab-logo-container">
                            <img src={mathVerseLogo} alt="MathVerse" className="lab-logo-img" />
                        </div>
                        <div className="lab-body">
                            <span className="lab-subtitle">LAB 2: VISUAL LEARNING</span>
                            <h3>MathVerse</h3>
                            <p className="lab-description">
                                State-of-the-art visual math portal with adaptive difficulty and progress tracking.
                            </p>

                            <div className="feature-badges">
                                <span>Visual Math</span>
                                <span>Adaptive</span>
                                <span>Tracking</span>
                            </div>

                            <button className="lab-btn lab-2-btn" onClick={() => navigate('/mathverse')}>
                                Open MathVerse →
                            </button>
                        </div>
                    </div>

                    {/* CARD 3: PRODUCT INFO (Standardized) */}
                    <div className="lab-card">
                        <div className="lab-logo-container">
                            <span className="info-icon" style={{ fontSize: '4rem' }}>📋</span>
                        </div>
                        <div className="lab-body">
                            <span className="lab-subtitle">PROJECT DOCUMENTATION</span>
                            <h3>Product Info</h3>
                            <p className="lab-description">
                                Project details, student profile, course information, and collaborators.
                            </p>

                            <div className="feature-badges">
                                <span>Profile</span>
                                <span>Course</span>
                                <span>Details</span>
                            </div>

                            <button className="lab-btn lab-3-btn" onClick={() => navigate('/product-info')}>
                                View Documentation →
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default WelcomePage;
