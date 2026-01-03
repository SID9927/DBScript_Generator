import React, { useEffect, useRef } from 'react';
import { DiffEditor, useMonaco } from '@monaco-editor/react';

const DiffEditorWrapper = ({ original, modified, language = 'plaintext', options = {} }) => {
    const monaco = useMonaco();
    const editorRef = useRef(null);

    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme('futuristic-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
                    { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'f1fa8c' },
                ],
                colors: {
                    'editor.background': '#0f172a',
                    'editor.lineHighlightBackground': '#1e293b',
                    'diffEditor.insertedTextBackground': '#064e3b4d',
                    'diffEditor.removedTextBackground': '#7f1d1d4d',
                }
            });
            monaco.editor.setTheme('futuristic-dark');
        }
    }, [monaco]);
    const [editorInstance, setEditorInstance] = React.useState(null);

    useEffect(() => {
        if (!monaco || !monaco.commands || !monaco.languages || !editorInstance) return;

        const cmdId = 'diff_merge_block';
        const lensEmitter = new monaco.Emitter();

        // Dispose any existing command with this ID to prevent collision on re-mounts
        // Note: registerCommand returns a disposable, but we can't easily check if it exists globally.
        // We rely on the cleanup function to dispose it. 

        const cmdDisposable = monaco.commands.registerCommand(cmdId, (accessor, { line, direction, isOriginal }) => {
            try {
                const diffEditor = editorInstance;
                // Double check if models are still alive
                const model = diffEditor.getModel();
                if (!model || !model.original || !model.modified) return;

                const changes = diffEditor.getLineChanges();
                if (!changes) return;

                const change = changes.find(c => {
                    const start = isOriginal ? c.originalStartLineNumber : c.modifiedStartLineNumber;
                    return start === line || (start === 0 && line === (isOriginal ? c.originalEndLineNumber + 1 : c.modifiedEndLineNumber + 1));
                });

                if (!change) return;

                const originalModel = model.original;
                const modifiedModel = model.modified;

                if (direction === 'right') {
                    // Original -> Modified
                    const text = originalModel.getValueInRange({
                        startLineNumber: change.originalStartLineNumber,
                        startColumn: 1,
                        endLineNumber: change.originalEndLineNumber,
                        endColumn: originalModel.getLineMaxColumn(change.originalEndLineNumber)
                    });

                    let range;
                    if (change.modifiedStartLineNumber === 0) {
                        const insertAt = change.modifiedEndLineNumber + 1;
                        range = new monaco.Range(insertAt, 1, insertAt, 1);
                    } else {
                        range = new monaco.Range(
                            change.modifiedStartLineNumber,
                            1,
                            change.modifiedEndLineNumber,
                            modifiedModel.getLineMaxColumn(change.modifiedEndLineNumber)
                        );
                    }

                    modifiedModel.pushEditOperations([], [{
                        range: range,
                        text: text + (change.originalStartLineNumber > 0 && change.modifiedStartLineNumber === 0 ? '\n' : '')
                    }], () => null);

                } else {
                    // Modified -> Original
                    const text = modifiedModel.getValueInRange({
                        startLineNumber: change.modifiedStartLineNumber,
                        startColumn: 1,
                        endLineNumber: change.modifiedEndLineNumber,
                        endColumn: modifiedModel.getLineMaxColumn(change.modifiedEndLineNumber)
                    });

                    let range;
                    if (change.originalStartLineNumber === 0) {
                        const insertAt = change.originalEndLineNumber + 1;
                        range = new monaco.Range(insertAt, 1, insertAt, 1);
                    } else {
                        range = new monaco.Range(
                            change.originalStartLineNumber,
                            1,
                            change.originalEndLineNumber,
                            originalModel.getLineMaxColumn(change.originalEndLineNumber)
                        );
                    }

                    originalModel.pushEditOperations([], [{
                        range: range,
                        text: text + (change.modifiedStartLineNumber > 0 && change.originalStartLineNumber === 0 ? '\n' : '')
                    }], () => null);
                }
            } catch (err) {
                console.error("Error executing merge command:", err);
            }
        });

        const providerDisposable = monaco.languages.registerCodeLensProvider({ pattern: '**' }, {
            onDidChange: lensEmitter.event,
            provideCodeLenses: function (model, token) {
                const models = editorInstance.getModel();
                if (!models || (model !== models.original && model !== models.modified)) return { lenses: [], dispose: () => { } };

                const changes = editorInstance.getLineChanges();
                if (!changes) return { lenses: [], dispose: () => { } };

                const lenses = [];

                changes.forEach(change => {
                    if (model === models.original) {
                        lenses.push({
                            range: {
                                startLineNumber: change.originalStartLineNumber > 0 ? change.originalStartLineNumber : 1,
                                startColumn: 1,
                                endLineNumber: change.originalEndLineNumber > 0 ? change.originalEndLineNumber : 1,
                                endColumn: 1
                            },
                            command: {
                                id: cmdId,
                                title: 'Merge to Right →',
                                arguments: [{ line: change.originalStartLineNumber || change.originalEndLineNumber + 1, direction: 'right', isOriginal: true }]
                            }
                        });
                    } else if (model === models.modified) {
                        lenses.push({
                            range: {
                                startLineNumber: change.modifiedStartLineNumber > 0 ? change.modifiedStartLineNumber : 1,
                                startColumn: 1,
                                endLineNumber: change.modifiedEndLineNumber > 0 ? change.modifiedEndLineNumber : 1,
                                endColumn: 1
                            },
                            command: {
                                id: cmdId,
                                title: '← Merge to Left',
                                arguments: [{ line: change.modifiedStartLineNumber || change.modifiedEndLineNumber + 1, direction: 'left', isOriginal: false }]
                            }
                        });
                    }
                });

                return { lenses, dispose: () => { } };
            }
        });

        const diffUpdateListener = editorInstance.onDidUpdateDiff(() => {
            lensEmitter.fire();
        });

        return () => {
            cmdDisposable.dispose();
            providerDisposable.dispose();
            diffUpdateListener.dispose();
            lensEmitter.dispose();
        }
    }, [monaco, editorInstance]);

    const handleEditorDidMount = (editor) => {
        setEditorInstance(editor);
    };

    // Force update options when wordWrap changes to ensure both sides update
    useEffect(() => {
        if (!editorInstance) return;

        const wrapState = options.wordWrap ? 'on' : 'off';

        // Update the main diff editor options
        editorInstance.updateOptions({
            diffWordWrap: wrapState
        });

        // Explicitly update inner editors to ensure they respect the setting
        // This is crucial for 'originalEditable: true' which might treat the left side as a standalone editor in some contexts
        editorInstance.getOriginalEditor().updateOptions({ wordWrap: wrapState });
        editorInstance.getModifiedEditor().updateOptions({ wordWrap: wrapState });

    }, [editorInstance, options.wordWrap]);

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
            <DiffEditor
                height="100%"
                original={original}
                modified={modified}
                language={language}
                theme="futuristic-dark"
                options={{
                    renderSideBySide: true,
                    originalEditable: true,
                    readOnly: false,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: '"Fira Code", monospace',
                    automaticLayout: true,
                    diffWordWrap: options.wordWrap ? 'on' : 'off',
                    ignoreTrimWhitespace: options.ignoreWhitespace || false,
                    renderIndicators: true
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default DiffEditorWrapper;

