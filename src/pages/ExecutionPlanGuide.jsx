import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, staggerItem } from '../utils/animations';

const ExecutionPlanGuide = () => {
    const [executionPlan, setExecutionPlan] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('guide');

    // Analyze execution plan and provide suggestions
    const analyzeExecutionPlan = () => {
        const suggestions = [];
        const warnings = [];
        const info = [];

        const planLower = executionPlan.toLowerCase();

        // Check for common performance issues
        if (planLower.includes('table scan') || planLower.includes('clustered index scan')) {
            warnings.push({
                title: 'Table/Index Scan Detected',
                description: 'Full table or index scans can be slow on large tables.',
                suggestion: 'Consider adding appropriate indexes on columns used in WHERE, JOIN, or ORDER BY clauses.',
                severity: 'high'
            });
        }

        if (planLower.includes('key lookup') || planLower.includes('rid lookup')) {
            warnings.push({
                title: 'Lookup Operations Found',
                description: 'Key/RID lookups indicate the index doesn\'t cover all required columns.',
                suggestion: 'Create a covering index that includes all columns needed by the query.',
                severity: 'medium'
            });
        }

        if (planLower.includes('sort')) {
            info.push({
                title: 'Sort Operation Detected',
                description: 'Sorting can be expensive, especially on large datasets.',
                suggestion: 'If sorting by indexed columns, ensure the index order matches the ORDER BY clause.',
                severity: 'low'
            });
        }

        if (planLower.includes('hash match')) {
            info.push({
                title: 'Hash Match Operation',
                description: 'Hash joins are used when no suitable indexes exist.',
                suggestion: 'Consider adding indexes on join columns to enable merge or nested loop joins.',
                severity: 'medium'
            });
        }

        if (planLower.includes('nested loops')) {
            suggestions.push({
                title: 'Nested Loops Join',
                description: 'Efficient for small datasets or when one table is small.',
                suggestion: 'Good performance if inner table has an index on join column.',
                severity: 'info'
            });
        }

        if (planLower.includes('merge join')) {
            suggestions.push({
                title: 'Merge Join Detected',
                description: 'Very efficient when both inputs are sorted.',
                suggestion: 'This is generally a good sign - both tables have appropriate indexes.',
                severity: 'info'
            });
        }

        if (planLower.includes('index seek')) {
            suggestions.push({
                title: 'Index Seek Found',
                description: 'Excellent! Index seeks are very efficient.',
                suggestion: 'This indicates proper index usage. Keep these indexes maintained.',
                severity: 'info'
            });
        }

        if (planLower.includes('parallelism') || planLower.includes('parallel')) {
            info.push({
                title: 'Parallel Execution',
                description: 'Query is using multiple CPU cores.',
                suggestion: 'Good for large datasets, but may indicate missing indexes if unexpected.',
                severity: 'low'
            });
        }

        if (planLower.includes('spool')) {
            warnings.push({
                title: 'Spool Operation Detected',
                description: 'Spools store intermediate results, which can be memory-intensive.',
                suggestion: 'Review query logic - sometimes indicates suboptimal query design.',
                severity: 'medium'
            });
        }

        if (planLower.includes('missing index')) {
            warnings.push({
                title: 'Missing Index Hint',
                description: 'SQL Server suggests creating an index.',
                suggestion: 'Review the missing index details and create appropriate indexes.',
                severity: 'high'
            });
        }

        setAnalysis({
            warnings,
            suggestions,
            info,
            totalIssues: warnings.length,
            hasIssues: warnings.length > 0
        });
    };

    const executionPlanTerms = [
        {
            category: 'Scan Operations',
            terms: [
                {
                    name: 'Table Scan',
                    description: 'Reads every row in the table',
                    impact: 'High cost on large tables',
                    color: 'red',
                    icon: '🔴'
                },
                {
                    name: 'Clustered Index Scan',
                    description: 'Scans all rows in clustered index order',
                    impact: 'Better than table scan but still reads all rows',
                    color: 'orange',
                    icon: '🟠'
                },
                {
                    name: 'Index Scan',
                    description: 'Scans all rows in a non-clustered index',
                    impact: 'Moderate cost, reads entire index',
                    color: 'yellow',
                    icon: '🟡'
                }
            ]
        },
        {
            category: 'Seek Operations',
            terms: [
                {
                    name: 'Index Seek',
                    description: 'Efficiently finds specific rows using an index',
                    impact: 'Very efficient - best case scenario',
                    color: 'green',
                    icon: '🟢'
                },
                {
                    name: 'Clustered Index Seek',
                    description: 'Seeks specific rows using clustered index',
                    impact: 'Excellent performance',
                    color: 'green',
                    icon: '🟢'
                }
            ]
        },
        {
            category: 'Join Operations',
            terms: [
                {
                    name: 'Nested Loops',
                    description: 'Iterates outer table, seeks inner table for each row',
                    impact: 'Good for small datasets or when inner has index',
                    color: 'green',
                    icon: '🔄'
                },
                {
                    name: 'Hash Match',
                    description: 'Builds hash table from one input, probes with other',
                    impact: 'Good for large datasets without indexes',
                    color: 'yellow',
                    icon: '⚡'
                },
                {
                    name: 'Merge Join',
                    description: 'Merges two sorted inputs',
                    impact: 'Very efficient when both inputs are sorted',
                    color: 'green',
                    icon: '🔀'
                }
            ]
        },
        {
            category: 'Lookup Operations',
            terms: [
                {
                    name: 'Key Lookup',
                    description: 'Looks up additional columns from clustered index',
                    impact: 'Indicates non-covering index, can be expensive',
                    color: 'orange',
                    icon: '🔍'
                },
                {
                    name: 'RID Lookup',
                    description: 'Looks up row by Row ID (heap table)',
                    impact: 'Similar to Key Lookup, indicates missing coverage',
                    color: 'orange',
                    icon: '🔍'
                }
            ]
        },
        {
            category: 'Other Operations',
            terms: [
                {
                    name: 'Sort',
                    description: 'Sorts data (ORDER BY, GROUP BY, DISTINCT)',
                    impact: 'Can be expensive on large datasets',
                    color: 'yellow',
                    icon: '📊'
                },
                {
                    name: 'Filter',
                    description: 'Applies WHERE clause conditions',
                    impact: 'Low cost, but check if can be pushed to index',
                    color: 'blue',
                    icon: '🔽'
                },
                {
                    name: 'Compute Scalar',
                    description: 'Calculates computed columns or expressions',
                    impact: 'Usually low cost',
                    color: 'blue',
                    icon: '🧮'
                },
                {
                    name: 'Stream Aggregate',
                    description: 'Aggregates sorted input (COUNT, SUM, etc.)',
                    impact: 'Efficient when input is sorted',
                    color: 'green',
                    icon: '📈'
                },
                {
                    name: 'Table Spool',
                    description: 'Stores intermediate results in tempdb',
                    impact: 'Can be memory/IO intensive',
                    color: 'orange',
                    icon: '💾'
                },
                {
                    name: 'Parallelism',
                    description: 'Distributes work across multiple CPU cores',
                    impact: 'Good for large operations, overhead for small',
                    color: 'blue',
                    icon: '⚙️'
                }
            ]
        }
    ];

    const bestPractices = [
        {
            title: 'How to Get Execution Plan',
            icon: '📋',
            steps: [
                'In SQL Server Management Studio (SSMS), press Ctrl+M to enable "Include Actual Execution Plan"',
                'Or click "Include Actual Execution Plan" button in toolbar',
                'Execute your query',
                'View the execution plan in the "Execution Plan" tab',
                'Alternatively, use "Display Estimated Execution Plan" (Ctrl+L) without running the query'
            ]
        },
        {
            title: 'Reading Execution Plans',
            icon: '👁️',
            steps: [
                'Read from RIGHT to LEFT - data flows from right to left',
                'Look at the thickness of arrows - thicker = more rows',
                'Check the percentage cost of each operation',
                'Identify operations with high cost (> 10-20%)',
                'Look for warnings (yellow exclamation marks)',
                'Hover over operations to see detailed statistics'
            ]
        },
        {
            title: 'Key Metrics to Check',
            icon: '📊',
            steps: [
                'Estimated vs Actual Rows - large differences indicate stale statistics',
                'Estimated Subtree Cost - higher = more expensive',
                'Number of Executions - operations executed multiple times',
                'I/O Cost vs CPU Cost - identifies bottleneck type',
                'Warnings - missing indexes, implicit conversions, etc.'
            ]
        },
        {
            title: 'Common Optimization Strategies',
            icon: '🚀',
            steps: [
                'Add indexes on columns in WHERE, JOIN, ORDER BY clauses',
                'Create covering indexes to eliminate lookups',
                'Update statistics if estimated rows differ significantly from actual',
                'Avoid functions on indexed columns in WHERE clause',
                'Use appropriate data types to avoid implicit conversions',
                'Consider indexed views for complex aggregations',
                'Partition large tables if appropriate'
            ]
        }
    ];

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                className="text-4xl font-bold mb-3 gradient-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                SQL Execution Plan Guide
            </motion.h1>

            <motion.p
                className="text-gray-600 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Learn how to read and optimize SQL Server execution plans
            </motion.p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {['guide', 'terms', 'analyzer'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-indigo-500'
                            }`}
                    >
                        {tab === 'guide' && '📚 Guide'}
                        {tab === 'terms' && '📖 Terms Dictionary'}
                        {tab === 'analyzer' && '🔍 Plan Analyzer'}
                    </button>
                ))}
            </div>

            {/* Guide Tab */}
            {activeTab === 'guide' && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bestPractices.map((practice, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-indigo-200 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{practice.icon}</span>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {practice.title}
                                    </h3>
                                </div>
                                <ol className="space-y-2">
                                    {practice.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-2 text-gray-700">
                                            <span className="font-semibold text-indigo-600 min-w-[24px]">
                                                {idx + 1}.
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Terms Dictionary Tab */}
            {activeTab === 'terms' && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {executionPlanTerms.map((category, catIndex) => (
                        <motion.div key={catIndex} variants={staggerItem}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded"></span>
                                {category.category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.terms.map((term, termIndex) => (
                                    <div
                                        key={termIndex}
                                        className="bg-white rounded-lg p-4 shadow-md border-l-4 hover:shadow-lg transition-all"
                                        style={{
                                            borderLeftColor:
                                                term.color === 'red' ? '#ef4444' :
                                                    term.color === 'orange' ? '#f97316' :
                                                        term.color === 'yellow' ? '#eab308' :
                                                            term.color === 'green' ? '#22c55e' :
                                                                '#3b82f6'
                                        }}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-2xl">{term.icon}</span>
                                            <h3 className="font-bold text-gray-800">{term.name}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{term.description}</p>
                                        <p className="text-xs text-gray-500 italic">
                                            Impact: {term.impact}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Analyzer Tab */}
            {activeTab === 'analyzer' && (
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Paste Your Execution Plan
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Copy the execution plan text from SSMS and paste it here for analysis and optimization suggestions.
                        </p>
                        <textarea
                            className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-indigo-400 transition-colors custom-scrollbar"
                            placeholder="Paste execution plan text here...&#10;&#10;Example:&#10;|--Nested Loops(Inner Join)&#10;    |--Index Seek(OBJECT:([dbo].[Customers].[IX_CustomerID]))&#10;    |--Key Lookup(OBJECT:([dbo].[Orders].[PK_Orders]))&#10;&#10;Or paste XML execution plan..."
                            value={executionPlan}
                            onChange={(e) => setExecutionPlan(e.target.value)}
                        />
                        <motion.button
                            className="btn-primary mt-4"
                            onClick={analyzeExecutionPlan}
                            disabled={!executionPlan.trim()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            🔍 Analyze Execution Plan
                        </motion.button>
                    </div>

                    {/* Analysis Results */}
                    {analysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Summary */}
                            <div className={`rounded-xl p-6 ${analysis.hasIssues
                                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200'
                                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                                }`}>
                                <h3 className="text-2xl font-bold mb-2">
                                    {analysis.hasIssues ? '⚠️ Issues Found' : '✅ Looking Good!'}
                                </h3>
                                <p className="text-gray-700">
                                    {analysis.hasIssues
                                        ? `Found ${analysis.totalIssues} potential performance issue(s) that need attention.`
                                        : 'No major performance issues detected. Review the suggestions below for optimization opportunities.'}
                                </p>
                            </div>

                            {/* Warnings */}
                            {analysis.warnings.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-4">
                                        🔴 Performance Warnings
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.warnings.map((warning, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-lg p-5 shadow-md border-l-4 border-red-500"
                                            >
                                                <h4 className="font-bold text-gray-800 mb-2">
                                                    {warning.title}
                                                </h4>
                                                <p className="text-gray-600 mb-2">{warning.description}</p>
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                                                    <p className="text-sm font-semibold text-blue-800">
                                                        💡 Suggestion: {warning.suggestion}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            {analysis.info.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-yellow-600 mb-4">
                                        🟡 Additional Information
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.info.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-lg p-5 shadow-md border-l-4 border-yellow-500"
                                            >
                                                <h4 className="font-bold text-gray-800 mb-2">
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-600 mb-2">{item.description}</p>
                                                <p className="text-sm text-gray-700">
                                                    💡 {item.suggestion}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {analysis.suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-green-600 mb-4">
                                        🟢 Good Practices Detected
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.suggestions.map((suggestion, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500"
                                            >
                                                <h4 className="font-bold text-gray-800 mb-2">
                                                    {suggestion.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {suggestion.description}
                                                </p>
                                                <p className="text-xs text-gray-700">
                                                    {suggestion.suggestion}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ExecutionPlanGuide;
