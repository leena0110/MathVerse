import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const { progress, settings = {} } = useProgress();
    const [activeTab, setActiveTab] = useState('overview'); // For managing tabs if needed, but single page is fine

    // Transform progress data for charts
    const chartData = [
        {
            name: 'Quantity',
            correct: progress.quantityComparison?.correct || 0,
            incorrect: (progress.quantityComparison?.completed || 0) - (progress.quantityComparison?.correct || 0),
            accuracy: progress.quantityComparison?.completed > 0 ? Math.round((progress.quantityComparison.correct / progress.quantityComparison.completed) * 100) : 0
        },
        {
            name: 'Number Line',
            correct: progress.numberLineAddition?.correct || 0,
            incorrect: (progress.numberLineAddition?.completed || 0) - (progress.numberLineAddition?.correct || 0),
            accuracy: progress.numberLineAddition?.completed > 0 ? Math.round((progress.numberLineAddition.correct / progress.numberLineAddition.completed) * 100) : 0
        },
        {
            name: 'Pattern',
            correct: progress.patternRecognition?.correct || 0,
            incorrect: (progress.patternRecognition?.completed || 0) - (progress.patternRecognition?.correct || 0),
            accuracy: progress.patternRecognition?.completed > 0 ? Math.round((progress.patternRecognition.correct / progress.patternRecognition.completed) * 100) : 0
        },
        {
            name: 'Sequencing',
            correct: progress.numberSequencing?.correct || 0,
            incorrect: (progress.numberSequencing?.completed || 0) - (progress.numberSequencing?.correct || 0),
            accuracy: progress.numberSequencing?.completed > 0 ? Math.round((progress.numberSequencing.correct / progress.numberSequencing.completed) * 100) : 0
        }
    ];

    // Calculate totals
    const totalRounds = chartData.reduce((acc, curr) => acc + curr.correct + curr.incorrect, 0);
    const totalCorrect = chartData.reduce((acc, curr) => acc + curr.correct, 0);
    const overallAccuracy = totalRounds > 0 ? Math.round((totalCorrect / totalRounds) * 100) : 0;
    const totalMinutes = Math.floor((progress.totalTime || 0) / 60);

    return (
        <div className={`pastel-background dashboard-container ${settings?.theme === 'dark-mode' ? 'dark-mode' : ''}`}>

            {/* Top Navigation */}
            <div className="game-nav-top">
                <button className="nav-button back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <button className="nav-button home-button" onClick={() => navigate('/')}>
                    🏠 Home
                </button>
            </div>

            <div className="content-centered">
                {/* Header Stats Row */}
                <div className="top-stats-row">
                    <div className="stat-box">
                        <div className="icon-box">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{totalRounds}</span>
                            <span className="stat-label">Total Rounds</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-box">✓</div>
                        <div className="stat-info">
                            <span className="stat-value">{overallAccuracy}%</span>
                            <span className="stat-label">Overall Accuracy</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-box">⏱</div>
                        <div className="stat-info">
                            <span className="stat-value">{totalMinutes}min</span>
                            <span className="stat-label">Time Spent</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon-box">🎮</div>
                        <div className="stat-info">
                            <span className="stat-value">{progress.sessions || 1}</span>
                            <span className="stat-label">Sessions</span>
                        </div>
                    </div>
                </div>

                <h2 className="section-title">Game Details</h2>

                {/* Game Details Grid */}
                <div className="details-grid">
                    <div className="detail-card yellow-border">
                        <h3 className="card-title">Quantity Comparison</h3>
                        <div className="card-row"><span>Level:</span> <span>Level {progress.quantityComparison?.level || 1}</span></div>
                        <div className="card-row"><span>Completed:</span> <span>{progress.quantityComparison?.completed || 0} rounds</span></div>
                        <div className="card-row"><span>Correct:</span> <span className="green-text">{progress.quantityComparison?.correct || 0}</span></div>
                        <div className="card-row"><span>Incorrect:</span> <span className="red-text">{(progress.quantityComparison?.completed || 0) - (progress.quantityComparison?.correct || 0)}</span></div>
                        <div className="divider"></div>
                        <div className="card-row highlight"><span>Accuracy:</span> <span>{chartData[0].accuracy}%</span></div>
                    </div>

                    <div className="detail-card blue-border">
                        <h3 className="card-title">Number Line Addition</h3>
                        <div className="card-row"><span>Level:</span> <span>Level {progress.numberLineAddition?.level || 1}</span></div>
                        <div className="card-row"><span>Completed:</span> <span>{progress.numberLineAddition?.completed || 0} rounds</span></div>
                        <div className="card-row"><span>Correct:</span> <span className="green-text">{progress.numberLineAddition?.correct || 0}</span></div>
                        <div className="card-row"><span>Incorrect:</span> <span className="red-text">{(progress.numberLineAddition?.completed || 0) - (progress.numberLineAddition?.correct || 0)}</span></div>
                        <div className="divider"></div>
                        <div className="card-row highlight"><span>Accuracy:</span> <span>{chartData[1].accuracy}%</span></div>
                    </div>

                    <div className="detail-card purple-border">
                        <h3 className="card-title">Pattern Recognition</h3>
                        <div className="card-row"><span>Level:</span> <span>Level {progress.patternRecognition?.level || 1}</span></div>
                        <div className="card-row"><span>Completed:</span> <span>{progress.patternRecognition?.completed || 0} rounds</span></div>
                        <div className="card-row"><span>Correct:</span> <span className="green-text">{progress.patternRecognition?.correct || 0}</span></div>
                        <div className="card-row"><span>Incorrect:</span> <span className="red-text">{(progress.patternRecognition?.completed || 0) - (progress.patternRecognition?.correct || 0)}</span></div>
                        <div className="divider"></div>
                        <div className="card-row highlight"><span>Accuracy:</span> <span>{chartData[2].accuracy}%</span></div>
                    </div>

                    <div className="detail-card orange-border">
                        <h3 className="card-title">Number Sequencing</h3>
                        <div className="card-row"><span>Level:</span> <span>Level {progress.numberSequencing?.level || 1}</span></div>
                        <div className="card-row"><span>Completed:</span> <span>{progress.numberSequencing?.completed || 0} rounds</span></div>
                        <div className="card-row"><span>Correct:</span> <span className="green-text">{progress.numberSequencing?.correct || 0}</span></div>
                        <div className="card-row"><span>Incorrect:</span> <span className="red-text">{(progress.numberSequencing?.completed || 0) - (progress.numberSequencing?.correct || 0)}</span></div>
                        <div className="divider"></div>
                        <div className="card-row highlight"><span>Accuracy:</span> <span>{chartData[3].accuracy}%</span></div>
                    </div>
                </div>

                <h2 className="section-title">Visual Analytics</h2>

                {/* Charts Area */}
                <div className="charts-container">
                    <div className="chart-card">
                        <h3>Accuracy by Game</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="accuracy" fill="#93C5FD" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Progress by Game</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="correct" fill="#4CAF50" name="Correct" radius={[5, 5, 0, 0]} />
                                <Bar dataKey="incorrect" fill="#FCA5A5" name="Incorrect" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="bottom-actions">
                    <button className="action-btn primary" onClick={() => navigate('/dashboard')}>Continue Learning</button>
                    <button className="action-btn secondary" onClick={() => navigate('/settings')}>Settings</button>
                    <button className="action-btn danger">Reset Progress</button>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
