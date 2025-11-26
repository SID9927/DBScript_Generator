/**
 * Production-Grade SQL Static Analysis Utility
 * Comprehensive performance analysis for enterprise stored procedures
 */

export const analyzeSP = (sqlCode) => {
  const analysis = {
    score: 100,
    issues: [],
    suggestions: [],
    summary: "",
    metrics: {
      complexity: 0,
      linesOfCode: sqlCode.split('\n').length,
      estimatedExecutionRisk: "Low"
    }
  };

  const lines = sqlCode.split('\n');
  const upperCode = sqlCode.toUpperCase();

  // --- 1. SELECT * Detection ---
  if (/\bSELECT\s+\*/i.test(sqlCode)) {
    analysis.score -= 15;
    analysis.issues.push({
      type: "Performance",
      severity: "High",
      message: "Avoid 'SELECT *'. Explicitly list columns to reduce I/O, enable covering indexes, and prevent breaking changes.",
      line: findLineNumber(lines, /SELECT\s+\*/i),
      suggestion: "Replace with: SELECT Col1, Col2, Col3 FROM..."
    });
  }

  // --- 2. Cursor Detection (Critical) ---
  if (/\bDECLARE\s+\w+\s+CURSOR\b/i.test(sqlCode)) {
    analysis.score -= 25;
    analysis.issues.push({
      type: "Performance",
      severity: "Critical",
      message: "CURSOR detected! Cursors process row-by-row and are 100-1000x slower than set-based operations.",
      line: findLineNumber(lines, /DECLARE\s+\w+\s+CURSOR\b/i),
      suggestion: "Rewrite using JOINs, CTEs, or window functions. Example: Use ROW_NUMBER() OVER() instead of cursor loops."
    });
  }

  // --- 3. Non-SARGable Predicates ---
  const sargablePatterns = [
    { 
      regex: /WHERE\s+.*\bYEAR\s*\(/i, 
      msg: "Function YEAR() on column prevents index usage.",
      fix: "Use: WHERE DateCol >= '2023-01-01' AND DateCol < '2024-01-01'"
    },
    { 
      regex: /WHERE\s+.*\bMONTH\s*\(/i, 
      msg: "Function MONTH() on column prevents index usage.",
      fix: "Use date range comparisons instead."
    },
    { 
      regex: /WHERE\s+.*\bLEFT\s*\(/i, 
      msg: "LEFT() function on column prevents index usage.",
      fix: "Use: WHERE Col LIKE 'ABC%' instead of WHERE LEFT(Col,3) = 'ABC'"
    },
    { 
      regex: /WHERE\s+.*\bISNULL\s*\(/i, 
      msg: "ISNULL() on indexed column can prevent index seek.",
      fix: "Consider: WHERE Col = @Value OR (@Value IS NULL AND Col IS NULL)"
    },
    { 
      regex: /WHERE\s+.*\bUPPER\s*\(/i, 
      msg: "UPPER() function prevents index usage.",
      fix: "Use case-insensitive collation or computed column with index."
    },
    { 
      regex: /WHERE\s+.*\bLOWER\s*\(/i, 
      msg: "LOWER() function prevents index usage.",
      fix: "Use case-insensitive collation or computed column with index."
    },
    { 
      regex: /WHERE\s+.*\bCONVERT\s*\(/i, 
      msg: "CONVERT() on column may prevent index usage.",
      fix: "Ensure data types match between column and parameter."
    }
  ];

  sargablePatterns.forEach(p => {
    if (p.regex.test(sqlCode)) {
      analysis.score -= 12;
      analysis.issues.push({
        type: "SARGable",
        severity: "High",
        message: p.msg,
        line: findLineNumber(lines, p.regex),
        suggestion: p.fix
      });
    }
  });

  // --- 4. Leading Wildcard in LIKE ---
  if (/LIKE\s+['"]%/i.test(sqlCode)) {
    analysis.score -= 10;
    analysis.issues.push({
      type: "Performance",
      severity: "Medium",
      message: "Leading wildcard '%value' prevents index usage and causes full table scan.",
      line: findLineNumber(lines, /LIKE\s+['"]%/i),
      suggestion: "Use Full-Text Search (CONTAINS) or consider redesign. If unavoidable, add non-leading wildcard index."
    });
  }

  // --- 5. Missing SET NOCOUNT ON ---
  if (!/\bSET\s+NOCOUNT\s+ON\b/i.test(sqlCode)) {
    analysis.score -= 5;
    analysis.suggestions.push({
      type: "Best Practice",
      message: "Add 'SET NOCOUNT ON' at the start to reduce network traffic and improve performance.",
      suggestion: "Add as first line after BEGIN: SET NOCOUNT ON;"
    });
  }

  // --- 6. Transaction Management ---
  const beginTranCount = (upperCode.match(/\bBEGIN\s+TRAN/g) || []).length;
  const commitCount = (upperCode.match(/\bCOMMIT/g) || []).length;
  const rollbackCount = (upperCode.match(/\bROLLBACK/g) || []).length;

  if (beginTranCount > 0 && (commitCount === 0 && rollbackCount === 0)) {
    analysis.score -= 15;
    analysis.issues.push({
      type: "Transaction",
      severity: "Critical",
      message: "BEGIN TRAN without COMMIT or ROLLBACK can cause locks to be held indefinitely!",
      line: findLineNumber(lines, /BEGIN\s+TRAN/i),
      suggestion: "Always pair BEGIN TRAN with COMMIT/ROLLBACK in TRY-CATCH blocks."
    });
  }

  if (beginTranCount > 0 && !/TRY\s*\n/i.test(sqlCode)) {
    analysis.score -= 8;
    analysis.suggestions.push({
      type: "Error Handling",
      message: "Transactions should be wrapped in TRY-CATCH for proper error handling and rollback.",
      suggestion: "Use: BEGIN TRY ... COMMIT TRAN ... END TRY BEGIN CATCH ... ROLLBACK TRAN ... END CATCH"
    });
  }

  // --- 7. NOLOCK Consistency ---
  const fromJoinCount = (upperCode.match(/\bFROM\s+|JOIN\s+/g) || []).length;
  const noLockCount = (upperCode.match(/\bNOLOCK\b/g) || []).length;
  
  if (fromJoinCount > 0 && noLockCount === 0 && /SELECT/i.test(sqlCode)) {
    analysis.suggestions.push({
      type: "Locking",
      message: "No NOLOCK hints found. For read-only reports, consider WITH (NOLOCK) to avoid blocking writers (accepts dirty reads).",
      suggestion: "Add WITH (NOLOCK) after table names if dirty reads are acceptable."
    });
  } else if (fromJoinCount > noLockCount && noLockCount > 0) {
    analysis.score -= 3;
    analysis.suggestions.push({
      type: "Locking",
      message: `Inconsistent NOLOCK usage: ${noLockCount} of ${fromJoinCount} tables have NOLOCK. Be consistent.`,
      suggestion: "Either use NOLOCK on all tables or none (or enable RCSI at database level)."
    });
  }

  // --- 8. OR in WHERE Clause ---
  if (/WHERE\s+.*\bOR\b/i.test(sqlCode) && !/\(.*OR.*\)/i.test(sqlCode)) {
    analysis.score -= 8;
    analysis.suggestions.push({
      type: "Performance",
      message: "OR conditions can prevent index usage. Consider UNION ALL or separate queries.",
      suggestion: "Example: SELECT ... WHERE A=1 UNION ALL SELECT ... WHERE B=2"
    });
  }

  // --- 9. NOT IN with Subquery ---
  if (/NOT\s+IN\s*\(/i.test(sqlCode)) {
    analysis.score -= 10;
    analysis.issues.push({
      type: "Performance",
      severity: "Medium",
      message: "NOT IN with subquery can be slow and has NULL handling issues.",
      line: findLineNumber(lines, /NOT\s+IN\s*\(/i),
      suggestion: "Use: NOT EXISTS (SELECT 1 FROM ... WHERE ...) or LEFT JOIN ... WHERE ... IS NULL"
    });
  }

  // --- 10. Scalar UDF in SELECT/WHERE ---
  if (/SELECT\s+.*dbo\.\w+\s*\(/i.test(sqlCode) || /WHERE\s+.*dbo\.\w+\s*\(/i.test(sqlCode)) {
    analysis.score -= 12;
    analysis.issues.push({
      type: "Performance",
      severity: "High",
      message: "Scalar UDF (User-Defined Function) calls can cause row-by-row execution (RBAR).",
      line: findLineNumber(lines, /dbo\.\w+\s*\(/i),
      suggestion: "Inline the logic, use inline table-valued functions, or rewrite as JOINs."
    });
  }

  // --- 11. Missing Error Handling ---
  if (!/BEGIN\s+TRY/i.test(sqlCode) && /BEGIN\s+TRAN/i.test(sqlCode)) {
    analysis.score -= 10;
    analysis.issues.push({
      type: "Error Handling",
      severity: "High",
      message: "No TRY-CATCH block found. Errors can leave transactions open and cause blocking.",
      line: findLineNumber(lines, /BEGIN\s+TRAN/i),
      suggestion: "Wrap transaction logic in TRY-CATCH with ROLLBACK in CATCH block."
    });
  }

  // --- 12. Dynamic SQL without sp_executesql ---
  if (/EXEC\s*\(/i.test(sqlCode) || /EXECUTE\s*\(/i.test(sqlCode)) {
    if (!/sp_executesql/i.test(sqlCode)) {
      analysis.score -= 8;
      analysis.suggestions.push({
        type: "Security",
        message: "Dynamic SQL detected. Use sp_executesql with parameters to prevent SQL injection and enable plan reuse.",
        suggestion: "EXEC sp_executesql @SQL, N'@Param INT', @Param = @Value"
      });
    }
  }

  // --- 13. Implicit Conversion Risk ---
  if (/WHERE\s+\w+\s*=\s*N'/i.test(sqlCode)) {
    analysis.suggestions.push({
      type: "Data Type",
      message: "NVARCHAR literal (N'...') detected. Ensure column is NVARCHAR to avoid implicit conversion.",
      suggestion: "Check: If column is VARCHAR, remove N prefix. If NVARCHAR, keep it."
    });
  }

  // --- 14. Temp Table vs Table Variable ---
  const tempTableCount = (upperCode.match(/#\w+/g) || []).length;
  const tableVarCount = (upperCode.match(/@\w+\s+TABLE/g) || []).length;

  if (tempTableCount > 0) {
    analysis.suggestions.push({
      type: "Memory",
      message: `${tempTableCount} temp table(s) detected. For <1000 rows, consider table variables to reduce TempDB overhead.`,
      suggestion: "DECLARE @MyTable TABLE (...) instead of CREATE TABLE #MyTable"
    });
  }

  // --- 15. Missing Index Hints (Advanced) ---
  if (/ORDER\s+BY/i.test(sqlCode) && !/INDEX/i.test(sqlCode)) {
    analysis.suggestions.push({
      type: "Indexing",
      message: "ORDER BY detected. Ensure there's an index supporting the sort order to avoid expensive sort operations.",
      suggestion: "Create index on ORDER BY columns or use WITH (INDEX(IX_YourIndex)) hint if needed."
    });
  }

  // --- 16. Large IN Lists ---
  const inMatch = sqlCode.match(/IN\s*\([^)]{100,}\)/i);
  if (inMatch) {
    analysis.score -= 5;
    analysis.suggestions.push({
      type: "Performance",
      message: "Large IN list detected (>100 chars). Consider using a temp table or table-valued parameter.",
      suggestion: "INSERT values into #TempTable and use: WHERE Col IN (SELECT Val FROM #TempTable)"
    });
  }

  // --- 17. Complexity Score ---
  const nestedLevels = (sqlCode.match(/\bBEGIN\b/gi) || []).length;
  const joins = (sqlCode.match(/\bJOIN\b/gi) || []).length;
  analysis.metrics.complexity = nestedLevels + joins;

  if (analysis.metrics.complexity > 10) {
    analysis.suggestions.push({
      type: "Maintainability",
      message: `High complexity (${analysis.metrics.complexity} points). Consider breaking into smaller procedures.`,
      suggestion: "Split complex logic into multiple focused procedures for better maintainability."
    });
  }

  // --- 18. Execution Risk Assessment ---
  if (analysis.score < 50) {
    analysis.metrics.estimatedExecutionRisk = "High";
  } else if (analysis.score < 75) {
    analysis.metrics.estimatedExecutionRisk = "Medium";
  }

  // --- Generate Summary ---
  if (analysis.score >= 90) {
    analysis.summary = "✅ Excellent! Production-ready code with minimal performance risks.";
  } else if (analysis.score >= 75) {
    analysis.summary = "⚠️ Good foundation, but address high-severity issues before production deployment.";
  } else if (analysis.score >= 50) {
    analysis.summary = "🔴 Needs optimization. Multiple performance bottlenecks detected that will impact production.";
  } else {
    analysis.summary = "🚨 Critical issues found! This code will cause severe performance problems in production. Immediate refactoring required.";
  }

  return analysis;
};

// Helper to find line number
const findLineNumber = (lines, regex) => {
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return null;
};
