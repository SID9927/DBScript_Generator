import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackupScript from './components/BackupScript';
import RollbackScript from './components/RollbackScript';
import SubNav from './components/SubNav';

const Placeholder = ({ title }) => (
  <div className="p-6 text-xl text-center text-gray-600">{title} Page Under Construction</div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SubNav />
        <Routes>
          <Route path="/sp/backup" element={<BackupScript />} />
          <Route path="/sp/rollback" element={<RollbackScript />} />
          <Route path="/table/alter" element={<Placeholder title="Alter Table" />} />
          <Route path="/table/backup" element={<Placeholder title="Backup Table" />} />
          <Route path="/table/rollback" element={<Placeholder title="Rollback Table" />} />
          <Route path="*" element={<Placeholder title="Select a Module" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
