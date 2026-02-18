import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './Dashboard.css';

// --- IMPORT YOUR GAME ICONS HERE ---
import quantityIcon from '../assets/quantity-comparison.png';
import numberLineIcon from '../assets/number-line.png';
import patternIcon from '../assets/pattern-recognition.png';
import sequencingIcon from '../assets/number-sequencing.png';
// ------------------------------------

// Stats helper component
const StatsRow = ({ stats }) => (
    <div className="stats-row">
        <div className="stat-item">
            <span>Level</span>
            <strong>{stats?.level || 1}</strong>
        </div>
        <div className="stat-item">
            <span>Completed</span>
            <strong>{stats?.completed || 0}</strong>
        </div>
        <div className="stat-item">
            <span>Accuracy</span>
            <strong>
                {stats?.completed > 0
                    ? Math.round((stats?.correct / stats?.completed) * 100)
                    : 0}%
            </strong>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    // Ensure progress defaults to empty object if undefined
    const { settings, progress = {} } = useProgress();

    return (
        <div className={`pastel-background dashboard-page ${settings?.theme === 'dark-mode' ? 'dark-mode' : ''}`}>

            {/* Home Button Top Left */}
            <button className="home-back-btn" onClick={() => navigate('/mathverse')}>
                ← Home
            </button>

            <div className="dashboard-header">
                <h1>Choose Your Game</h1>
                <p className="subtitle">Select an activity to practice your math skills</p>
            </div>

            <div className="game-grid">

                {/* Card 1: Quantity Comparison (Yellow/Orange Border) */}
                <div className="game-card card-yellow" onClick={() => navigate('/game/quantity-comparison')}>
                    <div className="card-icon">
                        <img src={quantityIcon} alt="Quantity Comparison" className="card-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerText = '🍎' }} />
                    </div>
                    <h2>Quantity Comparison</h2>
                    <p>Compare quantities visually (More, Less, Same)</p>
                    <StatsRow stats={progress?.quantityComparison} />
                    <button className="play-btn btn-yellow">Play Now →</button>
                </div>

                {/* Card 2: Number Line Addition (Blue Border) */}
                <div className="game-card card-blue" onClick={() => navigate('/game/number-line-addition')}>
                    <div className="card-icon">
                        <img src={numberLineIcon} alt="Number Line Addition" className="card-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerText = '📏' }} />
                    </div>
                    <h2>Number Line Addition</h2>
                    <p>Learn addition through visual movement</p>
                    <StatsRow stats={progress?.numberLineAddition} />
                    <button className="play-btn btn-blue">Play Now →</button>
                </div>

                {/* Card 3: Pattern Recognition (Purple Border) */}
                <div className="game-card card-purple" onClick={() => navigate('/game/pattern-recognition')}>
                    <div className="card-icon">
                        <img src={patternIcon} alt="Pattern Recognition" className="card-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerText = '🧩' }} />
                    </div>
                    <h2>Pattern Recognition</h2>
                    <p>Identify and complete patterns</p>
                    <StatsRow stats={progress?.patternRecognition} />
                    <button className="play-btn btn-purple">Play Now →</button>
                </div>

                {/* Card 4: Number Sequencing (Orange Border) */}
                <div className="game-card card-orange" onClick={() => navigate('/game/number-sequencing')}>
                    <div className="card-icon">
                        <img src={sequencingIcon} alt="Number Sequencing" className="card-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerText = '123' }} />
                    </div>
                    <h2>Number Sequencing</h2>
                    <p>Arrange numbers in the correct order</p>
                    <StatsRow stats={progress?.numberSequencing} />
                    <button className="play-btn btn-orange">Play Now →</button>
                </div>

            </div>

            <div className="bottom-nav">
                <button className="action-btn" onClick={() => navigate('/parent-dashboard')}>📊 View Progress</button>
                <button className="action-btn" onClick={() => navigate('/settings')}>⚙️ Settings</button>
            </div>

        </div>
    );
};

export default Dashboard;
