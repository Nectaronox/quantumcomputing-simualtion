import React from 'react';

const ResultDisplay = ({ executionResult }) => {
    if (executionResult?.error) {
        return (
            <div className="bg-red-900 border border-red-700 text-white p-4 rounded-lg shadow-lg h-full">
                <h2 className="text-2xl font-bold mb-2 text-red-300">Execution Error</h2>
                <p className="text-red-200">Could not complete the simulation.</p>
                <pre className="mt-2 text-sm bg-red-800 p-2 rounded whitespace-pre-wrap">
                    {executionResult.error}
                </pre>
            </div>
        );
    }

    if (!executionResult) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-center items-center h-full text-gray-400">
                <span>Your simulation results will appear here.</span>
            </div>
        );
    }
    
    const { charts, measurement_results } = executionResult;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">Simulation Results</h2>
            
            {(!charts || (!charts.measurement_histogram && !charts.probability_pie_chart)) && (
                <div className="text-center text-gray-500">No charts to display.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {charts?.measurement_histogram && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold mb-2 text-center text-gray-200">Measurement Counts</h3>
                        <img src={`data:image/png;base64,${charts.measurement_histogram}`} alt="Measurement Histogram" className="w-full h-auto rounded-md"/>
                    </div>
                )}
                {charts?.probability_pie_chart && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold mb-2 text-center text-gray-200">Probability Distribution</h3>
                        <img src={`data:image/png;base64,${charts.probability_pie_chart}`} alt="Probability Pie Chart" className="w-full h-auto rounded-md"/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultDisplay; 