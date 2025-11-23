import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubNav from './components/SubNav';
import Home from './components/Home';
import StoredProcedure from './pages/StoredProcedure';
import Tables from './pages/Tables';
import SPWithNoLockEnhancer from './pages/SPWithNoLockEnhancer';
import Indexes from './pages/Indexes';
import TriggersGuide from './pages/TriggersGuide';
import ViewsGuide from './pages/ViewsGuide';
import StoredProceduresGuide from './pages/StoredProceduresGuide';
import BackupRollbackHome from './pages/BackupRollbackHome';
import TablesGuide from './pages/TablesGuide';
import ExecutionPlanGuide from './pages/ExecutionPlanGuide';

const backupLinks = [
  { name: 'Home', to: '/backup&rollback' },
  { name: 'Stored Procedure', to: '/backup&rollback/sp' },
  { name: 'Table', to: '/backup&rollback/table' },
];

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SubNav basePath="/backup&rollback" links={backupLinks} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/backup&rollback" element={<BackupRollbackHome />} />
          <Route path="/backup&rollback/sp" element={<StoredProcedure />} />
          <Route path="/backup&rollback/table" element={<Tables />} />
          <Route path="/table" element={<Tables />} />
          <Route path="/withnolock" element={<SPWithNoLockEnhancer />} />
          <Route path="/indexes" element={<Indexes />} />
          <Route path="/triggers" element={<TriggersGuide />} />
          <Route path="/views" element={<ViewsGuide />} />
          <Route path="/stored-procedures-guide" element={<StoredProceduresGuide />} />
          <Route path='/table-guide' element={<TablesGuide />} />
          <Route path='/execution-plan' element={<ExecutionPlanGuide />} />
          <Route path="*" element={<Home title="Select a Module" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
