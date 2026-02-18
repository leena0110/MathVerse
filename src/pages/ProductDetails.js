import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './ProductDetails.css';
import leenaPic from '../assets/leena_pic.jpg';

const ProductDetails = () => {
    const navigate = useNavigate();
    const { settings = {} } = useProgress();

    return (
        <div className={`pastel-background product-page ${settings?.theme === 'dark-mode' ? 'dark-mode' : ''}`}>
            {/* Top Navigation */}
            <div className="game-nav-top">
                <button className="nav-button back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <button className="nav-button home-button" onClick={() => navigate('/mathverse')}>
                    🏠 Home
                </button>
            </div>

            <div className="content-centered reduced-width">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-image-wrapper">
                        <div className="profile-circle">
                            <img src={leenaPic} alt="Leena Sri K" className="profile-img" />
                        </div>
                    </div>
                    <h2 className="student-name">LEENA SRI K</h2>
                    <p className="student-roll">Roll No: CB.SC.U4CSE23526</p>
                    <p className="student-role">Full Stack Developer</p>
                </div>

                {/* Course Information Card */}
                <div className="info-card course-info">
                    <h2 className="section-header-blue">Course Information</h2>
                    <div className="text-content-centered">
                        <div className="info-item">
                            <span className="info-label">Course Code:</span>
                            <span className="info-value">23CSE461</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Course Name:</span>
                            <span className="info-value">Full Stack Frameworks</span>
                        </div>

                        <div className="teacher-details">
                            <h3 className="teacher-name">Dr. T. Senthil Kumar</h3>
                            <p className="teacher-role">Professor</p>
                            <p className="teacher-dept">Amrita School of Computing</p>
                            <p className="teacher-college">Amrita Vishwa Vidyapeetham</p>
                            <p className="teacher-address">Coimbatore - 641112</p>
                            <p className="teacher-email">Email: <a href="mailto:t_senthilkumar@cb.amrita.edu">t_senthilkumar@cb.amrita.edu</a></p>
                        </div>
                    </div>
                </div>

                {/* Collaborators / GitHub Card */}
                <div className="info-card collaborators-info">
                    <h2 className="section-header-blue">Project Details</h2>
                    <div className="text-content-centered">
                        <div className="info-item">
                            <span className="info-label">GitHub Repository:</span>
                            <a href="https://github.com/leena0110/MathVerse" target="_blank" rel="noopener noreferrer" className="github-link">
                                MathVerse Product Page
                            </a>
                        </div>
                        {/* Collaborators Section Removed as requested */}
                    </div>
                </div>

                {/* Project Overview Section */}
                <div className="project-details-card">
                    <h2 className="section-header-blue">Project Overview</h2>

                    <div className="text-content">
                        <h3 className="sub-header-black">1. Use Case</h3>
                        <p className="highlight-text">
                            <strong>Requirement for Autism:</strong> Children with autism often struggle with abstract concepts, sensory overload, and traditional high-pressure learning environments. This portal provides a structured, visual, and calm interface to bridge that gap.
                        </p>
                        <p className="sub-highlight">Key Challenges Addressed:</p>
                        <ul className="details-list">
                            <li>Difficulty with abstract numerical concepts (solved via Number Lines, Visual Quantities).</li>
                            <li>Sensory sensitivity (solved via Pastel colors, no loud noises, adjustable settings).</li>
                            <li>Anxiety (solved via No-timer default, positive-only feedback).</li>
                        </ul>
                        <p className="normal-text">
                            <strong>Novelty & Visualization:</strong> The integration of real-time visual feedback (e.g., jumping on a number line, pattern completion) with adaptive difficulty allows for <span className="highlight-contextual">Contextual Learning</span>. Math becomes a visible, tangible process rather than mental arithmetic alone.
                        </p>

                        <h3 className="sub-header-black">2. Implementation Highlights</h3>
                        <p className="normal-text">This Single Page Application (SPA), built with <strong>React.js</strong>, leverages:</p>
                        <ul className="details-list highlights-list">
                            <li><strong>Context API:</strong> Global state management for Settings and Progress tracking across games.</li>
                            <li><strong>React Router:</strong> Seamless navigation with zero page reloads (SPA).</li>
                            <li><strong>Custom Hooks:</strong> Encapsulated game logic (useProgress) for reusability.</li>
                            <li><strong>Dynamic CSS/Theme:</strong> High Contrast vs Pastel modes for accessibility.</li>
                        </ul>

                        <h3 className="sub-header-black">3. Impact</h3>
                        <div className="impact-box">
                            <p className="highlight-blue"><strong>Memory Improvement:</strong> Pattern recognition games enhance working memory.</p>
                            <p className="highlight-blue"><strong>Contextual Learning:</strong> Associating numbers with physical length (Number Line) or quantity (Comparison) builds number sense.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
