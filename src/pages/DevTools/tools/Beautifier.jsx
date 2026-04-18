import React from 'react';
import { ActionButton, DualEditor } from '../Components';

const Beautifier = ({ input, setInput, output, setOutput, error, setError, onReset, onCopy, copied }) => {
    const handleAction = (type) => {
        setError('');
        try {
            if (type === 'json-beautify') setOutput(JSON.stringify(JSON.parse(input), null, 2));
            else if (type === 'json-minify') setOutput(JSON.stringify(JSON.parse(input)));
            else if (type === 'xml-beautify') setOutput(formatXml(input));
            else if (type === 'xml-minify') setOutput(input.replace(/>\s+</g, '><').trim());
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
            if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
            else if (node.match(/^<\/\w/)) { if (pad !== 0) pad -= 1; }
            else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
            else indent = 0;
            let padding = '';
            for (let i = 0; i < pad; i++) padding += '  ';
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted.trim();
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionButton onClick={() => handleAction('json-beautify')}>JSON Format</ActionButton>
                <ActionButton onClick={() => handleAction('json-minify')}>JSON Minify</ActionButton>
                <ActionButton onClick={() => handleAction('xml-beautify')}>XML Format</ActionButton>
                <ActionButton onClick={() => handleAction('xml-minify')}>XML Minify</ActionButton>
            </div>
            <DualEditor input={input} setInput={setInput} output={output} error={error} onReset={onReset} onCopy={onCopy} copied={copied} />
        </div>
    );
};

export default Beautifier;
