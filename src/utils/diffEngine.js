/**
 * Computes the diff between two texts using a line-based LCS algorithm.
 *
 * @param {string} oldText - The original text.
 * @param {string} newText - The new text to compare against.
 * @returns {Array<{type: 'same' | 'added' | 'removed', content: string, lineNumber?: number}>}
 */
export const computeDiff = (oldText, newText) => {
  // Handle edge cases where inputs might be undefined/null
  const oldLines = (oldText || "").split(/\r?\n/);
  const newLines = (newText || "").split(/\r?\n/);

  const common = longestCommonSubsequence(oldLines, newLines);
  const result = [];

  let i = 0; // index for oldLines
  let j = 0; // index for newLines
  let k = 0; // index for common subsequence

  while (i < oldLines.length || j < newLines.length) {
    // match found in common subsequence
    if (
      k < common.length &&
      oldLines[i] === common[k] &&
      newLines[j] === common[k]
    ) {
      result.push({
        type: "same",
        content: oldLines[i],
        lineNumber: i + 1,
        newLineNumber: j + 1,
      });
      i++;
      j++;
      k++;
    }
    // handle deletions (lines in old but not in new/common)
    else if (
      j === newLines.length ||
      (k < common.length && oldLines[i] !== common[k])
    ) {
      // Check if we should actually be inserting (processed all deletions before next common)
      // But with LCS, if current mismatch, typically check if old[i] is next in common? No.
      // If old[i] is NOT the current common item, it means it was deleted between the previous common and the current common
      // UNLESS the current common item doesn't exist (end of common).

      // Heuristic: If we are not at end of newLines, and we see something from newLines that isn't the common item, it's an insertion?
      // Actually, the standard backtracking of LCS matrix gives the Diff.
      // But since we just have the LCS list, we iterate.

      // Simplification: treating blocks between LCS matches.

      // All lines in oldLines from i until the index of common[k] are DELETIONS
      // All lines in newLines from j until the index of common[k] are INSERTIONS

      // Let's find index of common[k] in oldLines specifically starting from i
      // But duplicate lines make this tricky.
      // Better approach: Calculate full Diff Matrix or reuse the LCS matrix logic.
      // Let's implement the Matrix approach for robustness instead of just the sequence list.

      // Fallback to a simpler block-based diff if we lose track?
      // No, let's use the matrix approach directly in a separate helper if needed,
      // but here let's stick to a robust simple one.

      // Re-implementing using the standard "SES" (Shortest Edit Script) via LCS Matrix.
      return computeDiffMatrix(oldLines, newLines);
    }
  }

  return result; // Should be unreachable with the matrix return above
};

function computeDiffMatrix(oldLines, newLines) {
  const N = oldLines.length;
  const M = newLines.length;
  const MAX = N + M;

  // DP Table for LCS length
  // dp[i][j] = length of LCS of oldLines[0..i-1] and newLines[0..j-1]
  const dp = Array(N + 1)
    .fill(0)
    .map(() => Array(M + 1).fill(0));

  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find the diff
  const result = [];
  let i = N;
  let j = M;

  const stack = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({
        type: "same",
        content: oldLines[i - 1],
        lineNumber: i,
        newLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        type: "added",
        content: newLines[j - 1],
        newLineNumber: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      stack.push({
        type: "removed",
        content: oldLines[i - 1],
        lineNumber: i,
      });
      i--;
    }
  }

  return stack.reverse();
}

// Helper for the initial thought process (unused now but kept for reference if needed)
function longestCommonSubsequence(oldLines, newLines) {
  // ... implementation omited in favor of matrix ...
  return [];
}
