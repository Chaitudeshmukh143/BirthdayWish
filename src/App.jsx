import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SurprisePage = lazy(() => import('./pages/SurprisePage'));

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="appLoader">Loading your surprise...</div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/surprise" element={<SurprisePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
