import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { ResultCard } from '../Components';

const DateEngine = ({ onCopy, error, setError }) => {
    const [dateTimeTab, setDateTimeTab] = useState('duration');
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [dateResult, setDateResult] = useState(null);
    const [tsInput, setTsInput] = useState('');
    const [tsResult, setTsResult] = useState('');
    const [dob, setDob] = useState('');
    const [ageAtDate, setAgeAtDate] = useState(new Date().toISOString().split('T')[0]);
    const [ageResult, setAgeResult] = useState(null);

    const calculateDateDiff = () => {
        setError('');
        if (!date1 || !date2) { setError("Please select both dates"); return; }
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setError("Invalid dates selected"); return; }
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
        setDateResult({ formatted: `${diffDays}d ${hours}h ${minutes}m ${seconds}s`, ms: diffTime.toLocaleString() + ' ms' });
    };

    const convertTimestamp = () => {
        setError('');
        try {
            if (!tsInput) { setError("Please enter a timestamp or date"); return; }
            if (/^\d+$/.test(tsInput)) {
                const date = new Date(parseInt(tsInput));
                setTsResult(`Local: ${date.toLocaleString()}\nUTC:   ${date.toISOString()}`);
            } else {
                const date = new Date(tsInput);
                if (isNaN(date.getTime())) throw new Error("Invalid format");
                setTsResult(date.getTime().toString() + ' ms');
            }
        } catch (err) {
            setError("Could not parse. Use numeric ms or 'YYYY-MM-DD'");
        }
    };

    const calculateAge = () => {
        setError('');
        if (!dob) { setError("Please select a Date of Birth"); return; }
        const birthDate = new Date(dob);
        const targetDate = ageAtDate ? new Date(ageAtDate) : new Date();
        if (birthDate > targetDate) { setError("Date of Birth cannot be after the comparison date"); return; }
        let years = targetDate.getFullYear() - birthDate.getFullYear();
        let months = targetDate.getMonth() - birthDate.getMonth();
        let days = targetDate.getDate() - birthDate.getDate();
        if (days < 0) {
            months -= 1;
            const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
            days += lastDayOfMonth;
        }
        if (months < 0) { years -= 1; months += 12; }
        setAgeResult({ years, months, days });
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Temporal Configuration</p>
                <button onClick={() => { setDate1(''); setDate2(''); setDateResult(null); setTsInput(''); setTsResult(''); setDob(''); setAgeResult(null); setError(''); }} className="text-[9px] font-black text-slate-600 hover:text-red-500 uppercase transition-colors">Reset Engine</button>
            </div>
            <div className="flex bg-slate-950 border border-slate-800 p-1.5 rounded-2xl w-fit mx-auto relative z-10">
                {['duration', 'timestamp', 'age'].map(t => (
                    <button key={t} onClick={() => setDateTimeTab(t)}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${dateTimeTab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {t}
                        {dateTimeTab === t && <motion.div layoutId="dt" className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-lg shadow-indigo-900/40" />}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {dateTimeTab === 'duration' && (
                    <motion.div key="dur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CustomDateTimePicker label="Observation Alpha (Start)" value={date1} onChange={setDate1} />
                            <CustomDateTimePicker label="Observation Omega (End)" value={date2} onChange={setDate2} />
                        </div>
                        <button onClick={calculateDateDiff} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/20 transition-all active:scale-95">Analyze Temporal Span</button>
                        {dateResult && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ResultCard label="Delta Format" value={dateResult.formatted} copy={onCopy} />
                                <ResultCard label="Absolute MS" value={dateResult.ms} copy={onCopy} />
                            </div>
                        )}
                    </motion.div>
                )}

                {dateTimeTab === 'timestamp' && (
                    <motion.div key="ts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        <div className="bg-slate-950/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
                            <div className="space-y-3 text-left px-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Atomic Value (ms/date)</label>
                                <div className="flex gap-4">
                                    <input type="text" value={tsInput} onChange={e => setTsInput(e.target.value)} placeholder="e.g. 1713284760000" 
                                        className="flex-grow bg-black/40 border border-slate-800 rounded-xl px-5 py-4 text-indigo-400 font-mono text-sm focus:border-indigo-500/30 transition-all" />
                                    <button onClick={convertTimestamp} className="px-10 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20">Convert</button>
                                </div>
                            </div>
                            {tsResult && <ResultCard label="Conversion Protocol" value={tsResult} copy={onCopy} />}
                        </div>
                    </motion.div>
                )}

                {dateTimeTab === 'age' && (
                    <motion.div key="age" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CustomDateTimePicker label="Entity Initialization (DOB)" value={dob} onChange={setDob} showTime={false} />
                            <CustomDateTimePicker label="Target Horizon (Default: Now)" value={ageAtDate} onChange={setAgeAtDate} showTime={false} />
                        </div>
                        <button onClick={calculateAge} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/20 transition-all active:scale-95">Calculate Entity Span</button>
                        {ageResult && (
                            <div className="grid grid-cols-3 gap-6">
                                <ResultCard label="Years" value={ageResult.years} color="indigo" />
                                <ResultCard label="Months" value={ageResult.months} color="amber" />
                                <ResultCard label="Days" value={ageResult.days} color="emerald" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <p className="text-red-400 text-center text-[10px] font-black uppercase tracking-widest mt-6 animate-pulse">!! {error} !!</p>}
        </div>
    );
};

export default DateEngine;
