/**
 * Parses SQL Server XML Execution Plan and returns analysis.
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
    },
    missingIndexes: [],
    warnings: [],
    expensiveOperations: [],
    recommendations: []
  };

  // 1. Basic Statement Info
  const stmt = xmlDoc.querySelector("StmtSimple");
  if (stmt) {
    analysis.summary.statement = stmt.getAttribute("StatementText") || "";
    analysis.summary.cost = parseFloat(stmt.getAttribute("StatementSubTreeCost") || "0");
    analysis.summary.cachedPlanSize = stmt.getAttribute("CachedPlanSize");
    analysis.summary.compileTime = stmt.getAttribute("CompileTime");
    analysis.summary.compileCPU = stmt.getAttribute("CompileCPU");
    analysis.summary.compileMemory = stmt.getAttribute("CompileMemory");
  }

  // 2. Missing Indexes
  const missingIndexes = xmlDoc.querySelectorAll("MissingIndex");
  missingIndexes.forEach(idx => {
    const group = idx.closest("MissingIndexGroup");
    const impact = group ? parseFloat(group.getAttribute("Impact") || "0") : 0;
    const schema = idx.getAttribute("Schema") || "";
    const table = idx.getAttribute("Table") || "";
    
    // Get columns
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

  // 3. Warnings
  const warnings = xmlDoc.querySelectorAll("Warnings");
  warnings.forEach(warning => {
    // Check for specific warning attributes/children
    if (warning.hasAttribute("NoJoinPredicate")) {
      analysis.warnings.push({
        type: "No Join Predicate",
        severity: "High",
        message: "A join is occurring without a predicate, which may result in a Cartesian product (Cross Join)."
      });
    }
    
    // Spills
    const spill = warning.querySelector("SpillToTempDb");
    if (spill) {
      analysis.warnings.push({
        type: "Spill to TempDB",
        severity: "Medium",
        message: "Operation ran out of memory and spilled to disk (TempDB). This kills performance.",
        details: `Spill Level: ${warning.getAttribute("SpillLevel") || "Unknown"}`
      });
    }

    // Conversions
    const conversion = warning.querySelector("PlanAffectingConvert");
    if (conversion) {
      analysis.warnings.push({
        type: "Implicit Conversion",
        severity: "Medium",
        message: "An implicit conversion is affecting plan choice. Check data types in WHERE clauses.",
        details: `Expression: ${conversion.getAttribute("Expression")}`
      });
    }
    
    // Columns with no statistics
    const noStats = warning.querySelectorAll("ColumnsWithNoStatistics ColumnReference");
    if (noStats.length > 0) {
       const cols = Array.from(noStats).map(c => c.getAttribute("Column")).join(", ");
       analysis.warnings.push({
        type: "Missing Statistics",
        severity: "Low",
        message: `Optimizer is guessing for columns: ${cols}. Update statistics.`
       });
    }
  });

  // 4. Expensive Operations (RelOp)
  const ops = xmlDoc.querySelectorAll("RelOp");
  const totalCost = analysis.summary.cost || 1; // avoid div by zero

  ops.forEach(op => {
    const physicalOp = op.getAttribute("PhysicalOp");
    const logicalOp = op.getAttribute("LogicalOp");
    const estCost = parseFloat(op.getAttribute("EstimatedTotalSubtreeCost") || "0");
    const estRows = parseFloat(op.getAttribute("EstimateRows") || "0");
    const parallel = op.getAttribute("Parallel") === "1";
    const nodeCostPercent = (estCost / totalCost) * 100;

    // Filter for significant operations
    if (nodeCostPercent > 5 || physicalOp.includes("Scan") || physicalOp.includes("Spool") || physicalOp.includes("Sort")) {
      
      let issue = null;
      let suggestion = null;

      // Analysis Logic
      if (physicalOp === "Table Scan") {
        issue = "Full Table Scan";
        suggestion = "Table is being fully read. Add an index on the filtered columns.";
      } else if (physicalOp === "Clustered Index Scan") {
        issue = "Clustered Index Scan";
        suggestion = "Scanning the entire table (via PK). Check if WHERE clause is sargable or if index is missing.";
      } else if (physicalOp === "Key Lookup" || (logicalOp === "Rid Lookup")) {
        issue = "Key/RID Lookup";
        suggestion = "Expensive lookup detected. Create a Covering Index (use INCLUDE) to eliminate this.";
      } else if (physicalOp === "Sort" && nodeCostPercent > 20) {
        issue = "Expensive Sort";
        suggestion = "Sorting is costly. Try to support the sort order with an index.";
      } else if (physicalOp === "Hash Match" && nodeCostPercent > 30) {
        issue = "Heavy Hash Match";
        suggestion = "Hash joins are memory intensive. Ensure indexes exist on join columns to encourage Nested Loops or Merge Join.";
      }

      if (issue || nodeCostPercent > 15) {
        analysis.expensiveOperations.push({
          op: physicalOp,
          logicalOp: logicalOp,
          costPercent: nodeCostPercent.toFixed(1),
          rows: estRows,
          parallel: parallel,
          issue: issue || "High Cost Operator",
          suggestion: suggestion || "Review this operator's logic."
        });
      }
    }
  });

  // Sort expensive ops by cost
  analysis.expensiveOperations.sort((a, b) => b.costPercent - a.costPercent);

  // Generate Recommendations
  if (analysis.missingIndexes.length > 0) {
    analysis.recommendations.push("Create the suggested missing indexes to improve performance immediately.");
  }
  if (analysis.warnings.some(w => w.type === "Spill to TempDB")) {
    analysis.recommendations.push("Investigate memory spills. You may need to update statistics, simplify the query, or increase max server memory.");
  }
  if (analysis.warnings.some(w => w.type === "Implicit Conversion")) {
    analysis.recommendations.push("Fix implicit conversions by ensuring variable types match column types (e.g., don't compare VARCHAR to NVARCHAR).");
  }
  if (analysis.expensiveOperations.some(op => op.issue === "Key/RID Lookup")) {
    analysis.recommendations.push("Eliminate Key Lookups by using INCLUDE columns in your non-clustered indexes.");
  }

  return analysis;
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
