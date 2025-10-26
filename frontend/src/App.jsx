import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import './App.css'; // Main layout styles

// Page Imports
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Route Protection Imports
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="page-wrapper"
        >
          <Routes location={location} key={location.pathname}>
            
            {/* Routes for logged-out users only */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Routes for logged-in users only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/plan" element={<PlanPage />} />
            </Route>
            
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App