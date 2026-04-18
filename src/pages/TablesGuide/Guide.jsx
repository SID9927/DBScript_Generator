import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const TableGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="info">
                        <strong>Architecture Protocol:</strong> Tables are the fundamental unit of relational storage. Optimization begins with rigorous data-typing and strategic normalization to minimize atomic redundancy.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4 text-left">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">📚</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-0.5 italic">Conceptual Core</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">The Relational <span className="text-indigo-400">Blueprint</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Think of a table as a <span className="text-white font-bold underline decoration-indigo-500/50 decoration-2">strongly-typed spreadsheet</span>. Columns define the schema (what kind of data), while rows represent individual records (the data itself).
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 opacity-80">PK Protocol</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Primary Key <br/>Enforcement</h3>
                         </div>
                         <p className="text-[10px] font-bold text-indigo-100 italic opacity-90 mt-4">
                            Guarantees unique row identification. Mandatory for relational integrity.
                         </p>
                    </div>
                </div>
            </div>

            {/* Data Types Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Data Type specifications</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    {[
                        { title: 'Numbers', icon: '🔢', items: ['INT (4 Bytes)', 'BIGINT (8 Bytes)', 'DECIMAL (10,2)'] },
                        { title: 'Text', icon: '📝', items: ['VARCHAR (ASCII)', 'NVARCHAR (Unicode)', 'CHAR (Fixed)'] },
                        { title: 'Temporal', icon: '⏳', items: ['DATE (YYYY-MM-DD)', 'DATETIME2 (Precise)', 'TIME'] },
                        { title: 'Binary / Other', icon: '💠', items: ['BIT (Boolean)', 'GUID (Unique ID)', 'VARBINARY'] }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <ul className="space-y-1.5">
                                {type.items.map((item, j) => (
                                    <li key={j} className="text-[10px] font-bold text-slate-500 tracking-tight flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* CRUD Operations */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">CRUD Implementation</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                         <div className="space-y-6">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">The Core <span className="text-indigo-400">Transactions</span></h2>
                                 <p className="text-sm font-medium text-slate-500 italic">Standard T-SQL patterns for record manipulation and schema definition.</p>
                             </div>
                             <div className="space-y-4">
                                 {[
                                     { label: 'INSERT', desc: 'Append new records to the storage buffer.' },
                                     { label: 'SELECT', desc: 'Retrieve filtered records from the table.' },
                                     { label: 'UPDATE', desc: 'Modify existing cell values in-place.' },
                                     { label: 'DELETE', desc: 'Remove records based on criteria.' }
                                 ].map((op, i) => (
                                     <div key={i} className="flex items-center gap-4 group">
                                         <span className="text-[10px] font-black text-indigo-500/40 group-hover:text-indigo-500 transition-colors">0{i+1}</span>
                                         <div>
                                             <span className="text-xs font-black text-white uppercase tracking-widest mr-3 italic group-hover:text-indigo-300 transition-colors">{op.label}</span>
                                             <span className="text-[10px] font-bold text-slate-600">{op.desc}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="relative">
                              <CodeBlock>{`-- 1. Initialize Schema
CREATE TABLE Employees (
    ID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    HireDate DATE DEFAULT GETDATE()
);

-- 2. Transactional Ops
INSERT INTO Employees (Name) VALUES ('Alice');
SELECT * FROM Employees WHERE ID = 1;`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableGuide;
