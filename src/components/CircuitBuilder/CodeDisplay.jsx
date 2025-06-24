import React from 'react';

const CodeDisplay = ({ generatedCode }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode).then(() => {
            // Optional: show a notification that text was copied
            console.log("Code copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy code: ', err);
        });
    };

    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-green-400">Generated Python Code</h3>
                <button 
                    onClick={copyToClipboard} 
                    className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                    aria-label="Copy code to clipboard"
                >
                    Copy
                </button>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-900 p-3 rounded-md overflow-auto flex-grow">
                <code>
                    {generatedCode || '// Your quantum code will appear here...'}
                </code>
            </pre>
        </div>
    );
};

export default CodeDisplay; 