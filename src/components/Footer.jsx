import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 mt-auto">
            {/* Main Footer Content */}
            <div className="max-w-8xl mx-auto px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-2">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/logoDB.png"
                                alt="DB Playground Logo"
                                className="h-10 w-auto"
                            />
                            {/* <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                DB Playground
                            </h3> */}
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-4 max-w-md">
                            Your comprehensive SQL Server toolkit for database developers. Generate scripts, analyze performance, and optimize queries with intelligent AI-powered tools.
                        </p>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider pb-2">
                        Resources :
                    </h4>
                        <a 
                            href="https://docs.microsoft.com/sql"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium border-b border-transparent hover:border-blue-300 pb-0.5"
                        >
                            SQL Server Docs
                        </a>
                    </div>

                    {/* Quick Links - Split into 2 columns */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links :</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="/backup&rollback" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Backup & Rollback
                                    </a>
                                </li>
                                <li>
                                    <a href="/table-guide" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Table
                                    </a>
                                </li>
                                <li>
                                    <a href="/stored-procedures-guide" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Stored Procedures
                                    </a>
                                </li>
                                <li>
                                    <a href="/function-guide" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Function
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider opacity-0">More Links</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/indexes" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Index
                                    </a>
                                </li>
                                <li>
                                    <a href="/execution-plan" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Execution Plan
                                    </a>
                                </li>
                                <li>
                                    <a href="/triggers" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Trigger
                                    </a>
                                </li>
                                <li>
                                    <a href="/views" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        View
                                    </a>
                                </li>
                                <li>
                                    <a href="/withnolock" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Performance
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>




                {/* Divider */}
                <div className="border-t border-slate-700/50 mt-2 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-slate-500 text-sm">
                            © {currentYear} <span className="text-slate-400 font-medium">DB Playground</span>. All rights reserved.
                        </p>

                        {/* Additional Links */}
                        <div className="flex gap-6 text-sm mr-16">
                            <a href="/privacy-policy" className="text-slate-500 hover:text-slate-300 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/terms-of-service" className="text-slate-500 hover:text-slate-300 transition-colors">
                                Terms of Service
                            </a>
                            <a href="/contact" className="text-slate-500 hover:text-slate-300 transition-colors">
                                Contact Me
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </footer>
    );
};

export default Footer;