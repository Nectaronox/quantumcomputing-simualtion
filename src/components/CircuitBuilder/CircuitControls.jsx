import React from 'react';

const CircuitControls = ({ numQubits, setNumQubits, resetCircuit, handleExecute, isExecuting }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <label htmlFor="numQubits" className="font-bold text-lg text-gray-300">
                    Qubits:
                </label>
                <input
                    id="numQubits"
                    type="number"
                    min="1"
                    max="8"
                    value={numQubits}
                    onChange={(e) => setNumQubits(parseInt(e.target.value, 10))}
                    className="bg-gray-700 text-white w-20 p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all text-lg"
                >
                    {isExecuting ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Executing...
                        </div>
                    ) : (
                        'Run Simulation'
                    )}
                </button>
                <button
                    onClick={resetCircuit}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all text-lg"
                >
                    Reset Circuit
                </button>
            </div>
        </div>
    );
};

export default CircuitControls; 