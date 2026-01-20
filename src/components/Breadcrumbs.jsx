import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeNameMap = {
    'backup&rollback': 'Backup & Rollback',
    'sp': 'Stored Procedure',
    'table': 'Table',
    'indexes': 'Index Guide',
    'triggers': 'Trigger Guide',
    'views': 'View Guide',
    'stored-procedures-guide': 'Stored Procedures Guide',
    'table-guide': 'Tables Guide',
    'execution-plan': 'Execution Plan',
    'diff-viewer': 'Diff Viewer',
    'alter-table': 'Alter Table',
    'withnolock': 'Performance (NoLock)',
    'contact': 'Contact',
    'terms-of-service': 'Terms of Service',
    'privacy-policy': 'Privacy Policy',
    'clipboard': 'Cloud Clipboard',
    'login': 'Login'
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on home page
    if (pathnames.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800">
            <div className="max-w-8xl mx-auto flex items-center text-sm text-slate-400">
                <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                </Link>

                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    // Get friendly name or fallback to title case
                    const name = routeNameMap[value] || value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    return (
                        <React.Fragment key={to}>
                            <span className="mx-2 text-slate-600">/</span>
                            {isLast ? (
                                <span className="text-slate-200 font-medium cursor-default">
                                    {name}
                                </span>
                            ) : (
                                <Link
                                    to={to}
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    {name}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumbs;
