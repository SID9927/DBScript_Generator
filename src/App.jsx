import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Navbar from './components/Navbar';
import SubNav from './components/SubNav';
import Home from './components/Home';
import StoredProcedure from './pages/StoredProcedure';
import Tables from './pages/Tables';
import Functions from './pages/Functions';
import SPWithNoLockEnhancer from './pages/SPWithNoLockEnhancer';
import Indexes from './pages/Indexes';
import TriggersGuide from './pages/TriggersGuide';
import ViewsGuide from './pages/ViewsGuide';
import StoredProceduresGuide from './pages/StoredProceduresGuide';
import TablesGuide from './pages/TablesGuide';
import ExecutionPlanGuide from './pages/ExecutionPlanGuide';
import DiffViewer from './pages/DiffViewer';
import AlterTableGenerator from './pages/AlterTableGenerator';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Footer from './components/Footer';

const backupLinks = [
  { name: 'Stored Procedure', to: '/backup&rollback/sp' },
  { name: 'Table', to: '/backup&rollback/table' },
  { name: 'Function', to: '/backup&rollback/function' },
];

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToTopButton />
      <div className="min-h-screen bg-slate-900 text-slate-200">
        <Navbar />
        <Breadcrumbs />
        <SubNav basePath="/backup&rollback" links={backupLinks} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/backup&rollback" element={<Navigate to="/backup&rollback/sp" replace />} />
          <Route path="/backup&rollback/sp" element={<StoredProcedure />} />
          <Route path="/backup&rollback/table" element={<Tables />} />
          <Route path="/backup&rollback/function" element={<Functions />} />
          <Route path="/table" element={<Tables />} />
          <Route path="/withnolock" element={<SPWithNoLockEnhancer />} />
          <Route path="/indexes" element={<Indexes />} />
          <Route path="/triggers" element={<TriggersGuide />} />
          <Route path="/views" element={<ViewsGuide />} />
          <Route path="/stored-procedures-guide" element={<StoredProceduresGuide />} />
          <Route path='/table-guide' element={<TablesGuide />} />
          <Route path='/execution-plan' element={<ExecutionPlanGuide />} />
          <Route path='/diff-viewer' element={<DiffViewer />} />
          <Route path='/alter-table' element={<AlterTableGenerator />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home title="Select a Module" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App
