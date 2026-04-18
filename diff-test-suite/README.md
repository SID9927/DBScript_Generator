# Quantum Diff Test Suite 📟

Use these files to verify the industry-grade features of the Quantum Diff Viewer.

### ⚡ Test 1: SQL Logic Normalization
*   **Files**: `sp_active_users_v1.sql` vs `sp_active_users_v2.sql`
*   **Steps**:
    1. Paste V1 in the left pane, V2 in the right pane.
    2. Switch to **'Norm' (Normalized)** mode.
    3. Set Grammar to **'SQL Query'**.
    4. Enable **'Whitespace', 'Casing', and 'Comments'** toggles.
*   **Expected**: The diff should show **Zero Changes**, proving the engine understands the logic is identical despite formatting noise.

### ⚡ Test 2: JSON Recursive Key-Sorting
*   **Files**: `response_v1.json` vs `response_v2.json`
*   **Steps**:
    1. Paste both JSON buffers.
    2. Switch to **'Norm'** mode.
    3. Set Grammar to **'JSON Structure'**.
*   **Expected**: The diff should show **Zero Changes**, proving the engine sorts keys recursively to ignore trivial ordering differences.

### ⚡ Test 3: FS Orchestrator
*   **Steps**:
    1. Switch to **'FS Orchestrator'** (Folder Mode).
    2. Select the `diff-test-suite` folder for both 'Left' and 'Right'.
    3. Select a file to see it load into the editor.
