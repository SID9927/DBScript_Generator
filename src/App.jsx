import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Navbar from './components/Navbar';
import SubNav from './components/SubNav';
import Home from './components/Home';
import SPBackup from './pages/BackupRollback/SPBackup';
import TableBackup from './pages/BackupRollback/TableBackup';
import FunctionBackup from './pages/BackupRollback/FunctionBackup';
import SPWithNoLockEnhancer from './pages/SPWithNoLockEnhancer/SPWithNoLockEnhancer';
import Indexes from './pages/Indexes/Indexes';
import TriggersGuide from './pages/TriggersGuide/TriggersGuide';
import ViewsGuide from './pages/ViewsGuide/ViewsGuide';
import StoredProceduresGuide from './pages/StoredProceduresGuide/StoredProceduresGuide';
import TablesGuide from './pages/TablesGuide/TablesGuide';
import FunctionsGuide from './pages/FunctionsGuide/FunctionsGuide';
import ExecutionPlanGuide from './pages/ExecutionPlanGuide/ExecutionPlanGuide';
import DiffViewer from './pages/DiffViewer/DiffViewer';
import AlterTableGenerator from './pages/AlterTableGenerator/AlterTableGenerator';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import DevTools from './pages/DevTools/index';
import Footer from './components/Footer';

const backupLinks = [
  { name: 'Stored Procedure', to: '/backup&rollback/sp' },
  { name: 'Table', to: '/backup&rollback/table' },
  { name: 'Function', to: '/backup&rollback/function' },
];

  import { AuthProvider } from './context/AuthContext';
  import Login from './pages/Login';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
        <div className="min-h-screen bg-slate-900 text-slate-200">
          <Navbar />
          <SubNav basePath="/backup&rollback" links={backupLinks} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/backup&rollback" element={<Navigate to="/backup&rollback/sp" replace />} />
            <Route path="/backup&rollback/sp" element={<SPBackup />} />
            <Route path="/backup&rollback/table" element={<TableBackup />} />
            <Route path="/backup&rollback/function" element={<FunctionBackup />} />
            <Route path="/table" element={<TableBackup />} />
            <Route path="/withnolock" element={<SPWithNoLockEnhancer />} />
            <Route path="/indexes" element={<Indexes />} />
            <Route path="/triggers" element={<TriggersGuide />} />
            <Route path="/views" element={<ViewsGuide />} />
            <Route path="/stored-procedures-guide" element={<StoredProceduresGuide />} />
            <Route path='/table-guide' element={<TablesGuide />} />
            <Route path='/function-guide' element={<FunctionsGuide />} />
            <Route path='/execution-plan' element={<ExecutionPlanGuide />} />
            <Route path='/diff-viewer' element={<DiffViewer />} />
            <Route path='/alter-table' element={<AlterTableGenerator />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devtools" element={<DevTools />} />
            <Route path="*" element={<Home title="Select a Module" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App
