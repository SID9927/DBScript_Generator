import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FileIcon = ({ type, status }) => {
    if (type === 'folder') return <span className="mr-2 text-yellow-500">📁</span>;
    if (status === 'removed') return <span className="mr-2 text-blue-400">📄</span>;
    if (status === 'added') return <span className="mr-2 text-purple-400">📄</span>;
    if (status === 'modified') return <span className="mr-2 text-red-400">📄</span>;
    return <span className="mr-2 text-slate-500">📄</span>;
};

const TreeNode = ({ node, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    const handleClick = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    return (
        <div className="pl-4">
            <div
                onClick={handleClick}
                className={`flex items-center py-1 cursor-pointer hover:bg-white/5 rounded px-2 transition-colors
                    ${node.status === 'modified' ? 'text-red-300' : ''}
                    ${node.status === 'added' ? 'text-purple-300' : ''}
                    ${node.status === 'removed' ? 'text-blue-300 italic' : ''}
                    ${node.status === 'same' ? 'text-slate-400' : ''}
                `}
            >
                <div className="w-4 flex justify-center text-xs text-slate-600 mr-1">
                    {hasChildren && (isOpen ? '▼' : '▶')}
                </div>
                <FileIcon type={node.type} status={node.status} />
                <span className="text-sm font-mono truncate">{node.name}</span>
                {node.status !== 'same' && node.status !== 'folder' && (
                    <span className={`ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded
                        ${node.status === 'modified' ? 'bg-red-900/40 text-red-200' : ''}
                        ${node.status === 'added' ? 'bg-purple-900/40 text-purple-200' : ''}
                        ${node.status === 'removed' ? 'bg-blue-900/40 text-blue-200' : ''}
                    `}>
                        {node.status}
                    </span>
                )}
            </div>
            {hasChildren && isOpen && (
                <div className="border-l border-slate-700/50 ml-2">
                    {node.children.map((child) => (
                        <TreeNode key={child.relativePath} node={child} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FolderCompare = ({ onFileSelect }) => {
    const fileInputLeft = React.useRef(null);
    const fileInputRight = React.useRef(null);
    const [leftFiles, setLeftFiles] = useState([]);
    const [rightFiles, setRightFiles] = useState([]);
    const [treeRoot, setTreeRoot] = useState(null);

    const handleFolderSelect = (e, side) => {
        const files = Array.from(e.target.files).map(file => ({
            name: file.name,
            path: file.webkitRelativePath,
            size: file.size,
            fileObj: file
        }));
        if (side === 'left') setLeftFiles(files);
        else setRightFiles(files);
    };

    const compareFolders = () => {
        if (!leftFiles.length || !rightFiles.length) return;
        const root = buildDirectoryTree(leftFiles, rightFiles);
        setTreeRoot(root);
    };

    const buildDirectoryTree = (left, right) => {
        const root = { name: 'Root', type: 'folder', children: [], relativePath: '' };

        const addToTree = (file, side) => {
            const parts = file.path.split('/');
            // Skip the first part if it's the folder name itself to unify roots if different names?
            // Actually webkitRelativePath includes the root folder name.
            // If dragging two different folders, roots differ. 
            // We should treat the top level as matched if we want to compare contents.
            // Let's normalize by stripping the first segment (root folder name).

            const normalizedParts = parts.slice(1);
            // If empty, it's the root itself? 

            let current = root;

            normalizedParts.forEach((part, index) => {
                const isFile = index === normalizedParts.length - 1;
                const pathSoFar = normalizedParts.slice(0, index + 1).join('/');

                let child = current.children.find(c => c.name === part);

                if (!child) {
                    child = {
                        name: part,
                        relativePath: pathSoFar,
                        type: isFile ? 'file' : 'folder',
                        children: [],
                        status: 'same' // Default, will refine
                    };
                    current.children.push(child);
                }

                if (isFile) {
                    if (side === 'left') child.leftFile = file;
                    if (side === 'right') child.rightFile = file;
                }

                current = child;
            });
        };

        left.forEach(f => addToTree(f, 'left'));
        right.forEach(f => addToTree(f, 'right'));

        // Post-process statuses
        const updateStatus = (node) => {
            if (node.type === 'folder') {
                node.children.forEach(updateStatus);
                // Folder status could be aggregate? For now nice to just leave as folder.
            } else {
                if (node.leftFile && !node.rightFile) node.status = 'removed';
                else if (!node.leftFile && node.rightFile) node.status = 'added';
                else if (node.leftFile && node.rightFile) {
                    // Primitive comparison
                    node.status = (node.leftFile.size !== node.rightFile.size) ? 'modified' : 'same';
                }
            }
            // Sort: folders first, then files
            node.children.sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
        };

        updateStatus(root);
        return root;
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700 p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div onClick={() => fileInputLeft.current.click()} className="p-3 border border-dashed border-slate-600 rounded cursor-pointer hover:border-blue-500 text-center">
                    <div className="text-blue-400 font-bold text-xs">SOURCE FOLDER</div>
                    <div className="text-slate-500 text-xs truncate">{leftFiles.length ? `${leftFiles.length} files` : 'Select Folder...'}</div>
                    <input type="file" ref={fileInputLeft} className="hidden" webkitdirectory="" mozdirectory="" directory="" multiple onChange={e => handleFolderSelect(e, 'left')} />
                </div>
                <div onClick={() => fileInputRight.current.click()} className="p-3 border border-dashed border-slate-600 rounded cursor-pointer hover:border-purple-500 text-center">
                    <div className="text-purple-400 font-bold text-xs">TARGET FOLDER</div>
                    <div className="text-slate-500 text-xs truncate">{rightFiles.length ? `${rightFiles.length} files` : 'Select Folder...'}</div>
                    <input type="file" ref={fileInputRight} className="hidden" webkitdirectory="" mozdirectory="" directory="" multiple onChange={e => handleFolderSelect(e, 'right')} />
                </div>
            </div>
            <button onClick={compareFolders} disabled={!leftFiles.length || !rightFiles.length} className="w-full py-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-blue-900 hover:to-purple-900 text-white text-xs font-bold rounded mb-4 transition-all uppercase tracking-widest shadow-lg disabled:opacity-50">
                Compare Structure
            </button>
            <div className="flex-1 overflow-auto custom-scrollbar bg-black/40 rounded border border-slate-800 p-2">
                {treeRoot ? (
                    treeRoot.children.map(node => <TreeNode key={node.relativePath} node={node} onSelect={onFileSelect} />)
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
                        <span className="text-3xl">📂</span>
                        <span className="text-xs uppercase tracking-wider">Load folders to compare</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolderCompare;
