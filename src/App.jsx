import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuantumEducation from './pages/QuantumEducation';
import CircuitBuilder from './pages/CircuitBuilder';
import AlgorithmTemplates from './pages/AlgorithmTemplates';
import AlgorithmSimulation from './pages/AlgorithmSimulation';
import BlochStudio from './pages/BlochStudio';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/education" element={<QuantumEducation />} />
          <Route path="/circuit-builder" element={<CircuitBuilder />} />
          <Route path="/templates" element={<AlgorithmTemplates />} />
          <Route path="/simulation" element={<AlgorithmSimulation />} />
          <Route path="/bloch-studio" element={<BlochStudio />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 

