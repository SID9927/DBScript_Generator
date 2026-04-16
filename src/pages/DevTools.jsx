import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { IconWrench, IconCompare } from '../components/Icons';
import CustomDateTimePicker from '../components/CustomDateTimePicker';

const DevTools = () => {
  const [activeTab, setActiveTab] = useState('beautifier');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [dateResult, setDateResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [base64Image, setBase64Image] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [tsInput, setTsInput] = useState('');
  const [tsResult, setTsResult] = useState('');

  const tabs = [
    { id: 'beautifier', name: 'Format & Minify', icon: <IconWrench className="w-5 h-5" /> },
    { id: 'converter', name: 'JSON <-> XML', icon: <IconCompare className="w-5 h-5" /> },
    { id: 'base64', name: 'Base64 Tools', icon: <IconWrench className="w-5 h-5" /> },
    { id: 'datetime', name: 'Date & Time', icon: <IconWrench className="w-5 h-5" /> },
  ];

  const handleAction = (type) => {
    setError('');
    try {
      if (type === 'json-beautify') {
        const obj = JSON.parse(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else if (type === 'json-minify') {
        const obj = JSON.parse(input);
        setOutput(JSON.stringify(obj));
      } else if (type === 'xml-beautify') {
        setOutput(formatXml(input));
      } else if (type === 'xml-minify') {
        setOutput(input.replace(/>\s+</g, '><').trim());
      } else if (type === 'json-to-xml') {
        const obj = JSON.parse(input);
        setOutput(jsonToXml(obj));
      } else if (type === 'xml-to-json') {
        const json = xmlToJson(input);
        setOutput(JSON.stringify(json, null, 2));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const formatXml = (xml) => {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) padding += '  ';
      formatted += padding + node + '\r\n';
      pad += indent;
    });
    return formatted.trim();
  };

  const jsonToXml = (obj, rootname = 'root') => {
    let xml = `<${rootname}>`;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        xml += jsonToXml(obj[key], key);
      } else {
        xml += `<${key}>${obj[key]}</${key}>`;
      }
    }
    xml += `</${rootname}>`;
    return formatXml(xml);
  };

  const xmlToJson = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid XML structure");
    }
    const parseNode = (node) => {
      if (node.nodeType === 3) return node.nodeValue.trim();
      const obj = {};
      if (node.hasAttributes()) {
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes.item(i);
          obj["@" + attr.nodeName] = attr.nodeValue;
        }
      }
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes.item(i);
          if (child.nodeType === 3 && !child.nodeValue.trim()) continue;
          const nodeName = child.nodeName;
          const value = parseNode(child);
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = value;
          } else {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(value);
          }
        }
      }
      return Object.keys(obj).length === 1 && obj["#text"] ? obj["#text"] : obj;
    };
    return parseNode(xmlDoc.documentElement);
  };

  const handleImageToBase64 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setOutput(result);
        setBase64Image(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBase64ToImage = () => {
    try {
      if (!input.startsWith('data:image')) {
        if (input.match(/^[A-Za-z0-9+/=]+$/)) {
          setBase64Image(`data:image/png;base64,${input}`);
        } else {
          setBase64Image(input);
        }
      } else {
        setBase64Image(input);
      }
    } catch (err) {
      setError("Invalid Base64 string");
    }
  };

  const calculateDateDiff = () => {
    if (!date1 || !date2) {
      setError("Please select both dates");
      return;
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      setError("Invalid dates selected");
      return;
    }
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    const ms = diffTime % 1000;

    setDateResult({
      formatted: `${diffDays}d ${hours}h ${minutes}m ${seconds}s`,
      ms: diffTime.toLocaleString() + ' ms'
    });
  };

  const toSqlDatetime = (date) => {
    const pad = (num, size = 2) => num.toString().padStart(size, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
  };

  const convertTimestamp = () => {
    setError('');
    try {
      if (!tsInput) {
        setError("Please enter a timestamp or date");
        return;
      }
      if (/^\d+$/.test(tsInput)) {
        const date = new Date(parseInt(tsInput));
        setTsResult(`Local: ${toSqlDatetime(date)}\nUTC:   ${date.toISOString().replace('T', ' ').replace('Z', '')}`);
      } else {
        const date = new Date(tsInput);
        if (isNaN(date.getTime())) throw new Error("Invalid format");
        setTsResult(date.getTime().toString() + ' ms');
      }
    } catch (err) {
      setError("Could not parse. Use numeric ms or 'YYYY-MM-DD'");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text || output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <SEO title="Developer Tools" description="Format, convert, and calculate with our developer utility suite." />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2"
          >
            Developer Toolbox
          </motion.h1>
          <p className="text-slate-400 font-medium opacity-80">Premium utilities for modern developers</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-2 border border-slate-700/50 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOutput(''); setError(''); setDateResult(null); setInput(''); setTsResult(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-slate-800/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8 min-h-[650px] flex flex-col shadow-2xl relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full flex-grow relative z-10"
                >
                  {activeTab === 'beautifier' && (
                    <div className="space-y-6 flex flex-col h-full flex-grow">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <ActionButton onClick={() => handleAction('json-beautify')}>JSON Beautify</ActionButton>
                        <ActionButton onClick={() => handleAction('json-minify')}>JSON Minify</ActionButton>
                        <ActionButton onClick={() => handleAction('xml-beautify')}>XML Beautify</ActionButton>
                        <ActionButton onClick={() => handleAction('xml-minify')}>XML Minify</ActionButton>
                      </div>
                      <ToolTextAreas input={input} setInput={setInput} output={output} error={error} copy={() => copyToClipboard(output)} copied={copied} />
                    </div>
                  )}

                  {activeTab === 'converter' && (
                    <div className="space-y-6 flex flex-col h-full flex-grow">
                      <div className="grid grid-cols-2 gap-3">
                        <ActionButton onClick={() => handleAction('json-to-xml')}>JSON to XML</ActionButton>
                        <ActionButton onClick={() => handleAction('xml-to-json')}>XML to JSON</ActionButton>
                      </div>
                      <ToolTextAreas input={input} setInput={setInput} output={output} error={error} copy={() => copyToClipboard(output)} copied={copied} />
                    </div>
                  )}

                  {activeTab === 'base64' && (
                    <div className="space-y-6 flex flex-col h-full flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-400">Image to Base64</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageToBase64}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 transition-all cursor-pointer"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                          <ActionButton onClick={handleBase64ToImage}>Preview Base64 String</ActionButton>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Base64 Data</label>
                            <button onClick={() => copyToClipboard(input || output)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors uppercase">
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <textarea
                            value={input || output}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste or upload Base64 content..."
                            className="w-full h-full min-h-[300px] bg-slate-950/50 border border-slate-700/50 rounded-2xl p-4 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all shadow-inner"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <label className="text-xs text-slate-500 mb-2 uppercase tracking-tighter font-bold">Live Preview</label>
                          <div className="w-full h-full min-h-[300px] bg-slate-950/80 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-center overflow-hidden shadow-inner group">
                            {base64Image ? (
                              <motion.img 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={base64Image} 
                                alt="Preview" 
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="text-center space-y-2">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 mx-auto flex items-center justify-center text-slate-700">
                                  <span className="text-2xl">?</span>
                                </div>
                                <p className="text-slate-600 italic text-sm">Waiting for data...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'datetime' && (
                    <div className="max-w-2xl mx-auto w-full py-8 space-y-12">
                      <section className="space-y-6">
                        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                          <div className="w-1 h-6 bg-blue-500 rounded-full" />
                          Duration Calculator
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CustomDateTimePicker
                            label="Start Point"
                            value={date1}
                            onChange={(val) => setDate1(val)}
                          />
                          <CustomDateTimePicker
                            label="End Point"
                            value={date2}
                            onChange={(val) => setDate2(val)}
                          />
                        </div>
                        <button 
                          onClick={calculateDateDiff}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 text-white to-blue-500 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/30 hover:brightness-110 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Calculate Difference
                        </button>
                        <AnimatePresence>
                          {dateResult && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                              <div className="text-left">
                                <p className="text-blue-400/60 uppercase text-[10px] font-black tracking-widest mb-1">Human Readable</p>
                                <p className="text-2xl font-black text-white">{dateResult.formatted}</p>
                              </div>
                              <div className="text-right md:border-l border-blue-500/20 md:pl-6">
                                <p className="text-blue-400/60 uppercase text-[10px] font-black tracking-widest mb-1">Total Time (ms)</p>
                                <p className="text-xl font-bold text-blue-400">{dateResult.ms}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </section>

                      <section className="space-y-6 pt-6 border-t border-slate-700/50">
                        <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                          <div className="w-1 h-6 bg-purple-500 rounded-full" />
                          Timestamp Converter (Milliseconds)
                        </h3>
                        <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">Timestamp (ms) or Date String</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={tsInput}
                                onChange={(e) => setTsInput(e.target.value)}
                                placeholder="e.g. 1713284760000"
                                className="flex-grow bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all font-mono text-sm" 
                              />
                              <button 
                                onClick={convertTimestamp}
                                className="px-6 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-all font-bold"
                              >
                                Convert
                              </button>
                            </div>
                          </div>
                          <AnimatePresence>
                            {tsResult && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl relative group"
                              >
                                <button 
                                  onClick={() => copyToClipboard(tsResult)}
                                  className="absolute top-2 right-2 text-[10px] bg-slate-800 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <p className="text-xs text-purple-400/60 uppercase font-black mb-2">Conversion Result</p>
                                <pre className="text-sm font-mono text-white whitespace-pre-wrap break-all">{tsResult}</pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </section>
                      {error && (
                        <p className="text-red-400 text-center text-sm font-medium">{error}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="py-2.5 px-4 bg-slate-700/30 hover:bg-blue-600 hover:text-white border border-slate-700 hover:border-blue-400 rounded-xl transition-all font-medium text-sm text-slate-300 active:scale-95 outline-none focus:ring-2 focus:ring-blue-500/50"
  >
    {children}
  </button>
);

const ToolTextAreas = ({ input, setInput, output, error, copy, copied }) => (
  <div className="flex flex-col lg:flex-row gap-4 flex-grow">
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Input</label>
        <button onClick={() => setInput('')} className="text-[10px] text-slate-600 hover:text-red-400 transition-colors uppercase font-bold">CLEAR</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your source here..."
        className="w-full flex-grow min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-2xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all shadow-inner"
      />
    </div>
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Output</label>
        <button onClick={copy} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors uppercase font-bold">
          {copied ? 'Copied!' : 'COPY'}
        </button>
      </div>
      <div className="relative flex-grow flex flex-col">
        <textarea
          readOnly
          value={output}
          className={`w-full flex-grow min-h-[400px] bg-slate-950/80 border ${error ? 'border-red-500/50' : 'border-slate-700/50'} rounded-2xl p-4 font-mono text-sm outline-none resize-none shadow-inner`}
        />
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-xl p-3 text-red-100 text-xs flex items-center gap-3 shadow-2xl"
            >
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] flex-shrink-0">!</span>
              <p className="font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

export default DevTools;
