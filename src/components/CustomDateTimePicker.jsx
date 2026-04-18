import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDateTimePicker = ({ value, onChange, label, showTime = true, color = 'blue' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'month', 'year'
  const containerRef = useRef(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setViewMode('calendar');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrev = () => {
    if (viewMode === 'calendar') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else if (viewMode === 'month') {
      setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    } else if (viewMode === 'year') {
      setViewDate(new Date(viewDate.getFullYear() - 12, viewDate.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'calendar') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else if (viewMode === 'month') {
      setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    } else if (viewMode === 'year') {
      setViewDate(new Date(viewDate.getFullYear() + 12, viewDate.getMonth(), 1));
    }
  };

  const selectDate = (day) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(viewDate.getFullYear());
    newDate.setMonth(viewDate.getMonth());
    newDate.setDate(day);
    setCurrentDate(newDate);
    onChange(newDate.toISOString());
  };

  const selectHour = (hour) => {
    const newDate = new Date(currentDate);
    newDate.setHours(hour);
    setCurrentDate(newDate);
    onChange(newDate.toISOString());
  };

  const selectMinute = (minute) => {
    const newDate = new Date(currentDate);
    newDate.setMinutes(minute);
    setCurrentDate(newDate);
    onChange(newDate.toISOString());
  };

  const selectMonth = (idx) => {
    setViewDate(new Date(viewDate.getFullYear(), idx, 1));
    setViewMode('calendar');
  };

  const selectYear = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setViewMode('month');
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    const prevMonthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-slate-600 text-[10px] p-1 text-center opacity-30">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const isSelected = currentDate.getDate() === i && 
                          currentDate.getMonth() === viewDate.getMonth() && 
                          currentDate.getFullYear() === viewDate.getFullYear();
        const isToday = new Date().getDate() === i && 
                       new Date().getMonth() === viewDate.getMonth() && 
                       new Date().getFullYear() === viewDate.getFullYear();

      days.push(
        <button
          key={i}
          onClick={() => selectDate(i)}
          className={`text-[10px] p-1 rounded-md transition-all hover:bg-${color}-600/20 ${
            isSelected ? `bg-${color}-600 text-white font-bold shadow-lg shadow-${color}-500/40` : 
            isToday ? `text-${color}-400 border border-${color}-500/30` : 'text-slate-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const years = Array.from({ length: 12 }, (_, i) => viewDate.getFullYear() - 6 + i); // Balanced 3x4 grid

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-700/50 rounded-lg p-2.5 text-left flex items-center justify-between hover:border-slate-500 hover:bg-slate-800 transition-all font-mono text-[12px] shadow-inner"
      >
        <span className={value ? 'text-slate-200' : 'text-slate-500'}>
          {value 
            ? new Date(value).toLocaleString([], showTime 
                ? { dateStyle: 'medium', timeStyle: 'short' } 
                : { dateStyle: 'medium' }) 
            : 'Set Date...'}
        </span>
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className={`absolute z-50 mt-1.5 bg-[#1a2233] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden flex flex-row ${showTime ? 'min-w-[280px] max-w-[340px]' : 'min-w-[230px] max-w-[230px]'}`}
          >
            {/* Calendar Section */}
            <div className={`p-3 flex-1 flex flex-col min-h-[220px] ${showTime ? 'border-r border-slate-700/30' : ''}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button 
                  onClick={() => setViewMode(viewMode === 'calendar' ? 'month' : viewMode === 'month' ? 'year' : 'year')}
                  className={`text-[11px] font-black text-slate-300 flex items-center gap-1 group hover:text-${color}-400 transition-colors`}
                >
                  {viewMode === 'calendar' ? `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}` : 
                   viewMode === 'month' ? viewDate.getFullYear() : 'Select Year'}
                  <svg className={`w-2.5 h-2.5 text-slate-500 group-hover:text-${color}-400 transition-colors`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </button>
                <div className="flex gap-0.5">
                  <button onClick={handlePrev} className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-500 hover:text-slate-300">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={handleNext} className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-500 hover:text-slate-300">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              {/* Body Views */}
              <div className="flex-grow">
                {viewMode === 'calendar' && (
                  <div className="grid grid-cols-7 gap-0.5 animate-in fade-in zoom-in-95 duration-200">
                    {daysOfWeek.map(day => (
                      <div key={day} className="text-[9px] font-black text-slate-600 text-center uppercase py-1">
                        {day}
                      </div>
                    ))}
                    {renderDays()}
                  </div>
                )}

                {viewMode === 'month' && (
                  <div className="grid grid-cols-3 gap-2 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => selectMonth(idx)}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                          viewDate.getMonth() === idx ? `bg-${color}-600 text-white` : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                {viewMode === 'year' && (
                  <div className="grid grid-cols-3 gap-2 py-2 max-h-[140px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => selectYear(y)}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                          viewDate.getFullYear() === y ? `bg-${color}-600 text-white` : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto border-t border-slate-700/30 pt-2 px-1">
                <button onClick={() => { onChange(''); setIsOpen(false); }} className={`text-[10px] text-${color}-400 hover:text-${color}-300 font-bold uppercase tracking-wider`}>Clear</button>
                <button onClick={() => { const n = new Date(); setCurrentDate(n); setViewDate(n); onChange(n.toISOString()); }} className={`text-[10px] text-${color}-400 hover:text-${color}-300 font-bold uppercase tracking-wider`}>Today</button>
              </div>
            </div>

            {/* Time Section */}
            {showTime && (
              <div className="bg-slate-900/40 w-20 flex flex-col h-[220px]">
                  {/* Header labels for clarity */}
                  <div className="flex border-b border-slate-700/30 bg-slate-950/30">
                    <div className="flex-1 py-1 text-[8px] font-black text-slate-500 text-center border-r border-slate-700/30">HH</div>
                    <div className="flex-1 py-1 text-[8px] font-black text-slate-500 text-center">MM</div>
                  </div>
                  
                  <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto scrollbar-hide border-r border-slate-700/20">
                        <div className="py-1">
                            {hours.map(h => (
                                <button
                                    key={h}
                                    onClick={() => selectHour(h)}
                                    className={`w-full text-center py-1.5 text-[10px] transition-colors ${
                                        currentDate.getHours() === h ? `bg-${color}-600 text-white font-bold` : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
                                    }`}
                                >
                                    {h.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="py-1">
                            {minutes.map(m => (
                                <button
                                    key={m}
                                    onClick={() => selectMinute(m)}
                                    className={`w-full text-center py-1.5 text-[10px] transition-colors ${
                                        currentDate.getMinutes() === m ? `bg-${color}-600 text-white font-bold` : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
                                    }`}
                                >
                                    {m.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>
                  </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDateTimePicker;
