import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import QuantityComparison from './pages/QuantityComparison';
import NumberLineAddition from './pages/NumberLineAddition';
import PatternRecognition from './pages/PatternRecognition';
import NumberSequencing from './pages/NumberSequencing';
import ParentDashboard from './pages/ParentDashboard';
import Settings from './pages/Settings';
import ProductDetails from './pages/ProductDetails';

// Separate component to use the context hook
// Trigger rebuild for ProductInfo update
const AppContent = () => {
  const { settings } = useProgress();
  const location = useLocation();

  useEffect(() => {
    // Dynamically update body class for global theme
    document.body.className = settings?.theme || 'pastel';
  }, [settings?.theme]);

  // Handle undefined settings safely
  const themeClass = settings?.theme || 'pastel';
  const animSpeed = settings?.animationSpeed === 'slow' ? '2s' : settings?.animationSpeed === 'fast' ? '0.5s' : '1s';

  return (
    <div className={`App ${themeClass}`} style={{
      '--anim-speed': animSpeed
    }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game/quantity-comparison" element={<QuantityComparison />} />
        <Route path="/game/number-line-addition" element={<NumberLineAddition />} />
        <Route path="/game/pattern-recognition" element={<PatternRecognition />} />
        <Route path="/game/number-sequencing" element={<NumberSequencing />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/product-info" element={<ProductDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App;
