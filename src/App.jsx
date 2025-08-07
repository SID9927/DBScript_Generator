import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubNav from './components/SubNav';
import Home from './components/Home';
import StoredProcedure from './pages/StoredProcedure';
import Tables from './pages/Tables';
import SPWithNoLockEnhancer from './pages/SPWithNoLockEnhancer';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SubNav />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sp" element={<StoredProcedure />} />
        <Route path="/table" element={<Tables />} />
        <Route path="/withnolock" element={<SPWithNoLockEnhancer />} />
          <Route path="*" element={<Home title="Select a Module" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
