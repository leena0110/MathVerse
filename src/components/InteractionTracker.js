import React, { useState, useEffect, useCallback, useRef } from 'react';
import './InteractionTracker.css';

/**
 * InteractionTracker
 * 
 * Research-backed interaction layer for neurodiverse learners.
 * Tracks keyboard, mouse, and screen events to:
 * 1. Provide visual feedback on every interaction (reduces anxiety)
 * 2. Log engagement data for the Parent Dashboard
 * 3. Detect hesitation (long pauses = possible confusion)
 */
const InteractionTracker = ({ onCapture, showPanel = true }) => {
    const [interactions, setInteractions] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [lastKey, setLastKey] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [keyCount, setKeyCount] = useState(0);
    const [hesitationAlert, setHesitationAlert] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const hesitationTimer = useRef(null);
    const panelRef = useRef(null);

    const addInteraction = useCallback((type, detail) => {
        const time = new Date().toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });

        setInteractions(prev => {
            // Smart De-duplication: If the last event is same type, just update it (e.g. "Mouse moving..." instead of 50 logs)
            if (prev.length > 0 && prev[0].type === type && type.includes('Mouse')) {
                const newLog = [...prev];
                newLog[0] = { ...newLog[0], detail, time, count: (newLog[0].count || 1) + 1 };
                return newLog;
            }
            // Add new entry
            return [{ type, detail, time }, ...prev].slice(0, 6); // Keep last 6 neat entries
        });

        if (hesitationTimer.current) clearTimeout(hesitationTimer.current);
        setHesitationAlert(false);
        hesitationTimer.current = setTimeout(() => {
            setHesitationAlert(true);
        }, 8000);
    }, []);

    // ─── Clean Coordinate Formatter ───
    const formatZone = (x, y) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let zoneX = x < width / 3 ? 'Left' : x > (2 * width) / 3 ? 'Right' : 'Center';
        let zoneY = y < height / 3 ? 'Top' : y > (2 * height) / 3 ? 'Bottom' : 'Middle';
        return `${zoneY}-${zoneX}`;
    };

    // ─── Keyboard Events ───
    useEffect(() => {
        const handleKeyDown = (e) => {
            setLastKey(e.key);
            setKeyCount(prev => prev + 1);
            // Only log meaningful keys, ignore repetitive shift/ctrl
            if (['Enter', 'Backspace', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) || e.key.length === 1) {
                addInteraction('⌨️ Input', `Typed "${e.key}"`);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [addInteraction]);

    // ─── Mouse Move (Sampled) ───
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ─── Mouse Click ───
    useEffect(() => {
        const handleClick = (e) => {
            setClickCount(prev => prev + 1);
            const zone = formatZone(e.clientX, e.clientY);
            addInteraction('🖱️ Interaction', `Clicked ${zone} area`);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [addInteraction]);

    // ─── Screen Capture ───
    const handleScreenCapture = () => {
        setIsCapturing(true);
        addInteraction('📸 Evidence', 'Screen Snapshot Saved');

        import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(document.body).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `student-progress-${Date.now()}.png`;
                link.href = imgData;
                link.click();
                setIsCapturing(false);
            });
        }).catch(err => {
            console.error(err);
            setIsCapturing(false);
        });
    };

    // ─── Visibility ───
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                addInteraction('⚠️ Attention', 'Tab minimized');
            } else {
                addInteraction('👀 Engagement', 'Returned to task');
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [addInteraction]);


    // ─── Hesitation Timer ───
    useEffect(() => {
        hesitationTimer.current = setTimeout(() => setHesitationAlert(true), 8000);
        return () => clearTimeout(hesitationTimer.current);
    }, []);

    if (!showPanel) return null;

    return (
        <div className="interaction-tracker" ref={panelRef}>
            {/* Hesitation Alert */}
            {hesitationAlert && (
                <div className="hesitation-badge">
                    💭 Student seems hesitant?
                </div>
            )}

            {/* Header Bar */}
            <div className="tracker-stats">
                <div className="tracker-header-text">
                    <span className="dot-indicator"></span> Live Engagement
                </div>
                <button
                    className="capture-btn"
                    onClick={handleScreenCapture}
                    disabled={isCapturing}
                    title="Save visual evidence of progress"
                >
                    {isCapturing ? 'Saving...' : '📸 Capture Evidence'}
                </button>
            </div>

            {/* Clean Log List */}
            <div className="tracker-log">
                {interactions.map((item, i) => (
                    <div key={i} className={`log-entry log-${item.type.split(' ')[0].replace('️', '')}`}>
                        <span className="log-time">{item.time}</span>
                        <span className="log-type">{item.type}</span>
                        <span className="log-detail">{item.detail} {item.count > 1 ? `(x${item.count})` : ''}</span>
                    </div>
                ))}
            </div>

            {/* Micro Stats Footer */}
            <div className="tracker-footer">
                <span>Clicks: {clickCount}</span> • <span>Keys: {keyCount}</span> • <span>Cursor: {mousePos.x}, {mousePos.y}</span>
            </div>
        </div>
    );
};

export default InteractionTracker;
