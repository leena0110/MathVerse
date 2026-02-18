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

                {/* Mission Section */}
                <div className="mission-section">
                    <h2>Our Vision</h2>
                    <p className="mission-text">
                        We develop specialized digital environments designed for neurodiverse minds.
                        By combining sensory regulation with interactive learning, we create a
                        continuum of support from emotional stability to academic excellence.
                    </p>
                </div>

                {/* Autism Empowerment Pillar */}
                <div className="autism-section">
                    <div className="section-content">
                        <div className="section-header">
                            <h2>Empowering Every Mind</h2>
                            <p>Tailored support for children with Autism Spectrum Disorder (ASD)</p>
                        </div>
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
                    </div>
                </div>

                {/* DUAL PORTAL SECTION */}
                <div className="labs-grid">
                    {/* Lab 1: CALM SENSE */}
                    <div className="lab-card">
                        <div className="lab-logo-container">
                            <img src={calmSenseLogo} alt="CalmSense Logo" className="lab-logo-img" />
                        </div>
                        <div className="lab-body">
                            <span className="lab-subtitle">Lab 1: Sensory Regulation</span>
                            <h3>CalmSense</h3>
                            <p className="lab-description">
                                CalmSense is a digital sensory regulation application designed specifically for autistic children
                                to help them manage emotions, practice calming techniques, and develop self-regulation skills
                                in a safe, engaging environment.
                            </p>

                            <div className="feature-badges">
                                <span>Breathing Exercises</span>
                                <span>Calming Sensory Tools</span>
                                <span>Emotion Recognition</span>
                                <span>Sound Therapy</span>
                                <span>Accessibility First</span>
                            </div>

                            <a
                                href="https://calm-sense-modified-gfuo5fbp3-leena0110s-projects.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lab-btn lab-1-btn"
                            >
                                Open CalmSense →
                            </a>
                        </div>
                    </div>

                    {/* Lab 2: MATH VERSE */}
                    <div className="lab-card">
                        <div className="lab-logo-container">
                            <img src={mathVerseLogo} alt="MathVerse Logo" className="lab-logo-img" />
                        </div>
                        <div className="lab-body">
                            <span className="lab-subtitle">Lab 2: Visual Learning</span>
                            <h3>MathVerse</h3>
                            <p className="lab-description">
                                The current state-of-the-art visual math portal, integrating adaptive difficulty
                                and progress tracking to make mathematics tangible for every mind.
                            </p>

                            <div className="feature-badges">
                                <span>Visual Learning</span>
                                <span>Adaptive Difficulty</span>
                                <span>Calm Environment</span>
                                <span>Progress Tracking</span>
                            </div>

                            <button className="lab-btn lab-2-btn" onClick={() => navigate('/mathverse')}>
                                Open MathVerse →
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WelcomePage;
