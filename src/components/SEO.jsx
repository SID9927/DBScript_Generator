import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type = 'website', name = 'DB Playground' }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>DB Playground | {title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

// Default props in case they aren't provided
SEO.defaultProps = {
    title: 'DB Playground',
    description: 'Your ultimate database freelance toolkit for SQL Server. Generate scripts, optimize performance, and master database concepts.',
    keywords: 'sql, database, sql server, script generator, backup script, rollback script, education, freelance, developer tools',
};

export default SEO;
