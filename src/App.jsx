import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Offline from './pages/Offline/index'; 
import DemoVariant1 from './components/ui/background-demo';

const backupLinks = [
  { name: 'Stored Procedure', to: '/backup&rollback/sp' },
  { name: 'Table', to: '/backup&rollback/table' },
  { name: 'Function', to: '/backup&rollback/function' },
];

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <Offline />;
  }

  // Calculate top padding based on route (if SubNav is present)
  // SubNav is present if path starts with /backup&rollback
  const hasSubNav = location.pathname.startsWith('/backup&rollback');

  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <div className="min-h-screen bg-slate-900 text-slate-200">
        <Navbar />
        <SubNav basePath="/backup&rollback" links={backupLinks} />
        
        {/* Dynamic Padding Wrapper to prevent fixed headers from obscuring content */}
        <div className={`transition-all duration-300 ${hasSubNav ? 'pt-26 md:pt-28' : 'pt-14 md:pt-16'}`}>
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
            <Route path="/background-demo" element={<DemoVariant1 />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
