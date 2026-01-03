import { format as formatSQL } from "sql-formatter";
import xmlFormatter from "xml-formatter";

/**
 * Normalizes text based on various rules and formatters.
 *
 * @param {string} text - The input text.
 * @param {Object} options - Normalization options.
 * @param {boolean} options.ignoreWhitespace - Trim and collapse whitespace.
 * @param {boolean} options.ignoreCase - Convert to lowercase.
 * @param {boolean} options.ignoreComments - Strip standard comments (C-style, SQL-style).
 * @param {'none'|'sql'|'json'|'xml'} options.format - Grammar-aware formatting.
 * @returns {string} - The normalized text.
 */
export const normalizeText = (text, options) => {
  let result = text || "";

  // 1. Grammar-aware formatting (Pre-processing)
  // This happens BEFORE stripping comments usually, because formatters need valid syntax.
  // However, if we want to ignore comments, we might want to strip them first?
  // Let's strip comments first if requested, as they are "noise".

  if (options.ignoreComments) {
    result = stripComments(result, options.format);
  }

  if (options.format === "sql") {
    try {
      result = formatSQL(result, { language: "tsql" });
    } catch (e) {
      console.warn("SQL Formatting failed, falling back to raw text", e);
    }
  } else if (options.format === "json") {
    try {
      const obj = JSON.parse(result);
      result = JSON.stringify(obj, null, 2);
    } catch (e) {
      // console.warn('JSON Formatting failed', e);
    }
  } else if (options.format === "xml") {
    try {
      result = xmlFormatter(result, {
        indentation: "  ",
        filter: (node) => node.type !== "Comment",
        collapseContent: true,
        lineSeparator: "\n",
      });
    } catch (e) {
      console.warn("XML Formatting failed", e);
    }
  }

  // 2. Whitespace Normalization
  if (options.ignoreWhitespace) {
    // Collapses multiple spaces/tabs into a single space and trims lines
    result = result
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter((line) => line.length > 0) // Optional: remove empty lines? maybe not.
      .join("\n");
  }

  // 3. Case Insensitivity (Visual only usually, but here we enforce it for diff)
  if (options.ignoreCase) {
    result = result.toLowerCase();
  }

  return result;
};

/**
 * Strips comments from code.
 */
const stripComments = (text, type) => {
  if (type === "sql") {
    // Remove -- comments and /* */ comments
    return text.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  }
  if (type === "xml") {
    // XML comments <!-- -->
    return text.replace(/<!--[\s\S]*?-->/g, "");
  }
  // Default (C-style / JSON / JS / SQL / Generic)
  // We strip both // and -- to cover most bases since users might not select the exact grammar
  return text
    .replace(/--.*$/gm, "") // SQL style
    .replace(/\/\/.*$/gm, "") // JS style
    .replace(/\/\*[\s\S]*?\*\//g, ""); // Multi-line
};
