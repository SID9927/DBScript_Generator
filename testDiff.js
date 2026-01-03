import { computeDiff } from "./src/utils/diffEngine.js";

const text1 = `Hello World
This is a test
Line to be removed
Unchanged Line`;

const text2 = `Hello World
This is a test modified
Unchanged Line
New Line Added`;

try {
  const diff = computeDiff(text1, text2);
  console.log("Diff Result:", JSON.stringify(diff, null, 2));

  // Simple assertion: should have "same" for Hello World, "removed"/"added" for the changed lines.
  const hasSame = diff.some(
    (d) => d.type === "same" && d.content === "Hello World"
  );
  const hasRemoved = diff.some(
    (d) => d.type === "removed" && d.content === "Line to be removed"
  );
  const hasAdded = diff.some(
    (d) => d.type === "added" && d.content === "New Line Added"
  );

  if (hasSame && hasRemoved && hasAdded) {
    console.log("TEST PASSED");
  } else {
    console.log("TEST FAILED");
  }
} catch (e) {
  console.error("Error running diff:", e);
}
