import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto text-slate-300">
            <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mb-4">
                    At DB Playground, we prioritize your privacy. This policy explains how we handle your data.
                </p>

                <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 my-6">
                    <h3 className="text-blue-400 font-bold text-lg mb-2">Client-Side Processing</h3>
                    <p className="text-blue-200">
                        <strong>Your Data Stays With You.</strong> All script generation (SQL backups, alter tables, etc.) is performed entirely within your web browser.
                        We do not transmit your database schema, table names, or script content to any server.
                    </p>
                </div>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h2>
                <p className="mb-4">
                    We collect minimal information only when you explicitly provide it:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                        <strong className="text-white">Contact Forms:</strong> If you reach out via our Contact page, we collect your Name and Email Address solely to respond to your inquiry.
                    </li>
                    <li>
                        <strong className="text-white">Usage Analytics:</strong> We may use basic, anonymous analytics to understand which tools are most popular, but this is not linked to your personal identity.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Cookies</h2>
                <p className="mb-4">
                    We use local storage in your browser to remember your preferences (like the last used suffixes or settings), but this data is not sent to us.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Third-Party Services</h2>
                <p className="mb-4">
                    This site may contain links to external resources (like Microsoft Docs). We are not responsible for the privacy practices of other sites.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
