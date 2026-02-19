import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductInfo.css';

// Images
import profilePic from '../assets/leena_pic.jpg';

const ProductInfo = () => {
    const navigate = useNavigate();

    return (
        <div className="product-info-page">
            <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

            <div className="info-content-container centered-layout">

                {/* --- STUDENT PROFILE --- */}
                <div className="info-card profile-card">
                    <div className="profile-image-wrapper">
                        <img src={profilePic} alt="Leena Sri K" className="student-photo" />
                    </div>
                    <h1 className="student-name">LEENA SRI K</h1>
                    <p className="student-roll">Roll No: CB.SC.U4CSE23526</p>
                </div>

                {/* --- COURSE INFORMATION --- */}
                <div className="info-card course-card">
                    <h2 className="section-header">COURSE INFORMATION</h2>

                    <div className="course-grid">
                        <div className="course-item">
                            <span className="label">Course Code:</span>
                            <span className="value">23CSE461</span>
                        </div>
                        <div className="course-item">
                            <span className="label">Course Name:</span>
                            <span className="value">Full Stack Frameworks</span>
                        </div>
                    </div>

                    <div className="faculty-details">
                        <p className="faculty-name">Dr. T. Senthil Kumar</p>
                        <p className="faculty-desig">Professor</p>
                        <p className="faculty-dept">Amrita School of Computing</p>
                        <p className="faculty-uni">Amrita Vishwa Vidyapeetham</p>
                        <p className="faculty-loc">Coimbatore - 641112</p>
                        <a href="mailto:t_senthilkumar@cb.amrita.edu" className="faculty-email">Email: t_senthilkumar@cb.amrita.edu</a>
                    </div>
                </div>

                {/* --- PROJECT & GITHUB --- */}
                <div className="info-card project-card">
                    <h2 className="section-header">PROJECT DETAILS</h2>

                    <div className="project-row">
                        <span className="label">GitHub Repository:</span>
                        <a href="https://github.com/leena0110/MathVerse" target="_blank" rel="noreferrer" className="github-link">
                            MathVerse Product Page
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProductInfo;
