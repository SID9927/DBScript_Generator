/**
 * Parses SQL Server XML Execution Plan and returns deep analysis.
 * @param {string} xmlContent - The raw XML string from a .sqlplan file.
 * @returns {Object} Analysis result containing issues, stats, and suggestions.
 */
export const parseAndAnalyzePlan = (xmlContent) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const analysis = {
    summary: {
      statement: "",
      cost: 0,
      cachedPlanSize: 0,
      compileTime: 0,
      compileCPU: 0,
      compileMemory: 0,
      degreeOfParallelism: 0,
    },
    missingIndexes: [],
    warnings: [],
    expensiveOperations: [],
    waitStats: [],
    parameterAnalysis: [],
    recommendations: [],
    aiSummary: "" // Natural language summary
  };

  // --- 1. Basic Statement Info ---
  const stmt = xmlDoc.querySelector("StmtSimple");
  if (stmt) {
    analysis.summary.statement = stmt.getAttribute("StatementText") || "";
    analysis.summary.cost = parseFloat(stmt.getAttribute("StatementSubTreeCost") || "0");
    analysis.summary.cachedPlanSize = stmt.getAttribute("CachedPlanSize");
    analysis.summary.compileTime = stmt.getAttribute("CompileTime");
    analysis.summary.compileCPU = stmt.getAttribute("CompileCPU");
    analysis.summary.compileMemory = stmt.getAttribute("CompileMemory");
    
    const queryPlan = stmt.querySelector("QueryPlan");
    if (queryPlan) {
      analysis.summary.degreeOfParallelism = queryPlan.getAttribute("DegreeOfParallelism") || 1;
    }
  }

  // --- 2. Missing Indexes ---
  const missingIndexes = xmlDoc.querySelectorAll("MissingIndex");
  missingIndexes.forEach(idx => {
    const group = idx.closest("MissingIndexGroup");
    const impact = group ? parseFloat(group.getAttribute("Impact") || "0") : 0;
    const schema = idx.getAttribute("Schema") || "";
    const table = idx.getAttribute("Table") || "";
    
    const columns = [];
    idx.querySelectorAll("ColumnGroup").forEach(cg => {
      const usage = cg.getAttribute("Usage");
      cg.querySelectorAll("Column").forEach(col => {
        columns.push({
          name: col.getAttribute("Name"),
          usage: usage // EQUALITY, INEQUALITY, INCLUDE
        });
      });
    });

    analysis.missingIndexes.push({
      impact: impact,
      table: `${schema}.${table}`,
      columns: columns,
      createScript: generateMissingIndexScript(schema, table, columns)
    });
  });

  // --- 3. Warnings & Alerts ---
  const warnings = xmlDoc.querySelectorAll("Warnings");
  warnings.forEach(warning => {
    if (warning.hasAttribute("NoJoinPredicate")) {
      analysis.warnings.push({
        type: "No Join Predicate",
        severity: "High",
        message: "A join is occurring without a predicate, potentially causing a Cartesian product (Cross Join)."
      });
    }
    
    const spill = warning.querySelector("SpillToTempDb");
    if (spill) {
      analysis.warnings.push({
        type: "Spill to TempDB",
        severity: "Medium",
        message: "Operation ran out of memory and spilled to disk (TempDB). This severely impacts performance.",
        details: `Spill Level: ${warning.getAttribute("SpillLevel") || "Unknown"}`
      });
    }

    const conversion = warning.querySelector("PlanAffectingConvert");
    if (conversion) {
      analysis.warnings.push({
        type: "Implicit Conversion",
        severity: "Medium",
        message: "An implicit conversion is affecting plan choice. Check data types in WHERE clauses.",
        details: `Expression: ${conversion.getAttribute("Expression")}`
      });
    }
    
    const noStats = warning.querySelectorAll("ColumnsWithNoStatistics ColumnReference");
    if (noStats.length > 0) {
       const cols = Array.from(noStats).map(c => c.getAttribute("Column")).join(", ");
       analysis.warnings.push({
        type: "Missing Statistics",
        severity: "Low",
        message: `Optimizer is guessing for columns: ${cols}. Update statistics immediately.`
       });
    }
  });

  // --- 4. Wait Stats Analysis ---
  const waitStats = xmlDoc.querySelectorAll("WaitStats > Wait");
  if (waitStats.length > 0) {
    waitStats.forEach(wait => {
      const type = wait.getAttribute("WaitType");
      const time = parseFloat(wait.getAttribute("WaitTimeMs"));
      const count = parseInt(wait.getAttribute("WaitCount"));
      
      // Filter for significant waits
      if (time > 100) {
        let explanation = "Generic wait.";
        if (type.startsWith("LATCH")) explanation = "Contention on internal SQL Server objects (pages, etc).";
        if (type.startsWith("PAGEIOLATCH")) explanation = "Waiting for data to be read from disk. Check I/O subsystem or missing indexes.";
        if (type.startsWith("CXPACKET")) explanation = "Parallelism synchronization wait. Often normal, but high values indicate skew.";
        if (type.startsWith("LCK")) explanation = "Blocking detected. One transaction is holding a lock another needs.";
        if (type === "SOS_SCHEDULER_YIELD") explanation = "CPU pressure. Threads are yielding processor time.";

        analysis.waitStats.push({ type, time, count, explanation });
      }
    });
    analysis.waitStats.sort((a, b) => b.time - a.time);
  }

  // --- 5. Parameter Sniffing Check ---
  const paramList = xmlDoc.querySelectorAll("ParameterList > ColumnReference");
  paramList.forEach(param => {
    const name = param.getAttribute("Column");
    const compiled = param.getAttribute("ParameterCompiledValue");
    const runtime = param.getAttribute("ParameterRuntimeValue");
    
    if (compiled !== runtime && compiled && runtime) {
      analysis.parameterAnalysis.push({
        name,
        compiled,
        runtime,
        warning: "Runtime value differs from compiled value. This may cause suboptimal plan usage (Parameter Sniffing)."
      });
    }
  });

  // --- 6. Expensive Operations (RelOp) ---
  const ops = xmlDoc.querySelectorAll("RelOp");
  const totalCost = analysis.summary.cost || 1;

  ops.forEach(op => {
    const physicalOp = op.getAttribute("PhysicalOp");
    const logicalOp = op.getAttribute("LogicalOp");
    const estCost = parseFloat(op.getAttribute("EstimatedTotalSubtreeCost") || "0");
    const estRows = parseFloat(op.getAttribute("EstimateRows") || "0");
    const estIO = parseFloat(op.getAttribute("EstimateIO") || "0");
    const estCPU = parseFloat(op.getAttribute("EstimateCPU") || "0");
    const parallel = op.getAttribute("Parallel") === "1";
    const nodeCostPercent = (estCost / totalCost) * 100;

    // Filter for significant operations
    if (nodeCostPercent > 5 || physicalOp.includes("Scan") || physicalOp.includes("Spool") || physicalOp.includes("Sort")) {
      
      let issue = null;
      let suggestion = null;

      // Deep Operator Analysis
      if (physicalOp === "Table Scan") {
        issue = "Full Table Scan";
        suggestion = "Reading every row. Add a Clustered Index or a Non-Clustered Index to support the query.";
      } else if (physicalOp === "Clustered Index Scan") {
        issue = "Clustered Index Scan";
        suggestion = "Scanning the entire table/index. Check if the WHERE clause is sargable or if a specific index is missing.";
      } else if (physicalOp === "Key Lookup" || (logicalOp === "Rid Lookup")) {
        issue = "Key/RID Lookup";
        suggestion = "Expensive lookup. The non-clustered index is useful but incomplete. Add INCLUDE columns to cover the query.";
      } else if (physicalOp === "Sort" && nodeCostPercent > 10) {
        issue = "Expensive Sort";
        suggestion = "Sorting is expensive. Can you pre-sort data with an index? Or remove the ORDER BY if not needed?";
      } else if (physicalOp === "Hash Match" && nodeCostPercent > 20) {
        issue = "Heavy Hash Match";
        suggestion = "Hash joins are CPU/Memory intensive. If possible, add indexes to facilitate a Nested Loops join (for small data) or Merge Join (for sorted data).";
      } else if (physicalOp === "Nested Loops" && estRows > 10000) {
        issue = "High Volume Nested Loops";
        suggestion = "Nested Loops are bad for large datasets. You might be missing an index on the inner table, or statistics are out of date.";
      }

      if (issue || nodeCostPercent > 10) {
        analysis.expensiveOperations.push({
          op: physicalOp,
          logicalOp: logicalOp,
          costPercent: nodeCostPercent.toFixed(1),
          rows: estRows,
          io: estIO,
          cpu: estCPU,
          parallel: parallel,
          issue: issue || "High Cost Operator",
          suggestion: suggestion || "Review this operator's logic and cost."
        });
      }
    }
  });

  analysis.expensiveOperations.sort((a, b) => parseFloat(b.costPercent) - parseFloat(a.costPercent));

  // --- 7. Generate Recommendations ---
  if (analysis.missingIndexes.length > 0) {
    analysis.recommendations.push({
        type: "Index",
        text: `Found ${analysis.missingIndexes.length} missing index(es) with high impact. Creating them is the #1 priority.`
    });
  }
  if (analysis.warnings.some(w => w.type === "Spill to TempDB")) {
    analysis.recommendations.push({
        type: "Memory",
        text: "Fix TempDB spills by updating statistics, simplifying the query, or increasing memory grants."
    });
  }
  if (analysis.warnings.some(w => w.type === "Implicit Conversion")) {
    analysis.recommendations.push({
        type: "Code",
        text: "Fix implicit conversions. Ensure variable types match column types exactly (e.g., NVARCHAR vs VARCHAR)."
    });
  }
  if (analysis.expensiveOperations.some(op => op.issue === "Key/RID Lookup")) {
    analysis.recommendations.push({
        type: "Index",
        text: "Eliminate Key Lookups by using INCLUDE columns in your non-clustered indexes."
    });
  }
  if (analysis.parameterAnalysis.length > 0) {
    analysis.recommendations.push({
        type: "Parameter",
        text: "Parameter sniffing detected. Consider using OPTION (RECOMPILE) or optimizing for the most common parameter value."
    });
  }

  // --- 8. AI Summary Generation ---
  analysis.aiSummary = generateAISummary(analysis);

  return analysis;
};

// Helper to generate natural language summary
const generateAISummary = (analysis) => {
    let summary = `This query has a total estimated cost of **${analysis.summary.cost.toFixed(2)}**. `;
    
    // Performance Verdict
    if (analysis.summary.cost < 1) summary += "It is relatively lightweight. ";
    else if (analysis.summary.cost < 10) summary += "It has a moderate cost. ";
    else summary += "It is a **heavy** query that likely needs optimization. ";

    // Bottleneck Identification
    const topOp = analysis.expensiveOperations[0];
    if (topOp) {
        summary += `The primary bottleneck is a **${topOp.op}** operation which consumes **${topOp.costPercent}%** of the batch cost. `;
        if (topOp.issue === "Full Table Scan" || topOp.issue === "Clustered Index Scan") {
            summary += "This indicates the query is reading more data than necessary, likely due to a missing index or non-SARGable WHERE clause. ";
        } else if (topOp.issue === "Key/RID Lookup") {
            summary += "This suggests your index finds the rows but doesn't contain all the needed columns, forcing a jump back to the main table. ";
        }
    }

    // Warnings
    if (analysis.warnings.length > 0) {
        const severe = analysis.warnings.filter(w => w.severity === "High" || w.severity === "Medium");
        if (severe.length > 0) {
            summary += `\n\n⚠️ **Critical Issues Detected:** We found ${severe.length} serious warning(s), including **${severe[0].type}**. ${severe[0].message} `;
        }
    }

    // Missing Indexes
    if (analysis.missingIndexes.length > 0) {
        summary += `\n\n💡 **Opportunity:** SQL Server explicitly suggests **${analysis.missingIndexes.length} missing index(es)** that could reduce cost by up to **${analysis.missingIndexes[0].impact.toFixed(0)}%**.`;
    }

    return summary;
};

// Helper to generate SQL for missing index
const generateMissingIndexScript = (schema, table, columns) => {
  const equality = columns.filter(c => c.usage === "EQUALITY").map(c => c.name);
  const inequality = columns.filter(c => c.usage === "INEQUALITY").map(c => c.name);
  const include = columns.filter(c => c.usage === "INCLUDE").map(c => c.name);

  const keyCols = [...equality, ...inequality].join(", ");
  const includeClause = include.length > 0 ? `\nINCLUDE (${include.join(", ")})` : "";
  const idxName = `IX_${table.replace(/\[|\]/g, '')}_${Date.now()}`;

  return `CREATE NONCLUSTERED INDEX [${idxName}]
ON [${schema}].[${table}] (${keyCols})${includeClause};`;
};
