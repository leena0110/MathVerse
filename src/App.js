import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import './App.css';

// Lazy load pages to avoid initialization issues and circular dependencies
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuantityComparison = lazy(() => import('./pages/QuantityComparison'));
const NumberLineAddition = lazy(() => import('./pages/NumberLineAddition'));
const PatternRecognition = lazy(() => import('./pages/PatternRecognition'));
const NumberSequencing = lazy(() => import('./pages/NumberSequencing'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

const AppContent = () => {
  const { settings } = useProgress();
  const location = useLocation();

  useEffect(() => {
    // Dynamically update body class for global theme
    if (settings && settings.theme) {
      document.body.className = settings.theme;
    } else {
      document.body.className = 'pastel';
    }
  }, [settings?.theme]);

  const themeClass = settings?.theme || 'pastel';
  const animSpeed = settings?.animationSpeed === 'slow' ? '2s' : settings?.animationSpeed === 'fast' ? '0.5s' : '1s';

  return (
    <div className={`App ${themeClass}`} style={{ '--anim-speed': animSpeed }}>
      <Suspense fallback={<div className="loading-screen">Loading Portal...</div>}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/mathverse" element={<HomePage />} />
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
      </Suspense>
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
