import React from 'react';
import { ActionButton, DualEditor } from '../Components';

const Converter = ({ input, setInput, output, setOutput, error, setError, onReset, onCopy, copied }) => {
    const handleAction = (type) => {
        setError('');
        try {
            if (type === 'json-to-xml') setOutput(jsonToXml(JSON.parse(input)));
            else if (type === 'xml-to-json') setOutput(JSON.stringify(xmlToJson(input), null, 2));
        } catch (err) {
            setError(err.message);
        }
    };

    const jsonToXml = (obj, rootname = 'root') => {
        let xml = `<${rootname}>`;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) xml += jsonToXml(obj[key], key);
            else xml += `<${key}>${obj[key]}</${key}>`;
        }
        xml += `</${rootname}>`;
        return formatXml(xml);
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

    const xmlToJson = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) throw new Error("Invalid XML structure");
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
                    if (typeof obj[nodeName] === "undefined") obj[nodeName] = value;
                    else {
                        if (!Array.isArray(obj[nodeName])) obj[nodeName] = [obj[nodeName]];
                        obj[nodeName].push(value);
                    }
                }
            }
            return Object.keys(obj).length === 1 && obj["#text"] ? obj["#text"] : obj;
        };
        return parseNode(xmlDoc.documentElement);
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto w-full">
                <ActionButton onClick={() => handleAction('json-to-xml')}>JSON ➔ XML</ActionButton>
                <ActionButton onClick={() => handleAction('xml-to-json')}>XML ➔ JSON</ActionButton>
            </div>
            <DualEditor input={input} setInput={setInput} output={output} error={error} onReset={onReset} onCopy={onCopy} copied={copied} />
        </div>
    );
};

export default Converter;
