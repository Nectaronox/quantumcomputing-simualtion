import React, { useState } from 'react';
import Gate from './Gate';

const CircuitGrid = ({
  numQubits,
  numSteps,
  gates,
  draggedGate,
  setDraggedGate,
  onDrop,
  onRemoveGate,
  availableGates,
}) => {
  const [dragOverPosition, setDragOverPosition] = useState(null);

  const handleDragStart = (e, gateType) => {
    setDraggedGate(gateType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e, qubit, step) => {
    e.preventDefault();
    if (draggedGate) {
      e.dataTransfer.dropEffect = 'copy';
      setDragOverPosition({ qubit, step });
    }
  };
  
  const handleDragLeave = (e) => {
      setDragOverPosition(null);
  }

  const handleDrop = (e, qubit, step) => {
    e.preventDefault();
    if (draggedGate) {
      onDrop(draggedGate, qubit, step);
    }
    setDraggedGate(null);
    setDragOverPosition(null);
  };
  
  const getGateAt = (qubit, step) => {
      return gates.find(g => 
        g.step === step && (g.qubit === qubit || g.controlQubit === qubit || g.targetQubit === qubit)
      );
  }

  const renderGridCell = (qubit, step) => {
    const gate = getGateAt(qubit, step);
    const isDragOver = dragOverPosition?.qubit === qubit && dragOverPosition?.step === step;

    let cnotLineStyle = {};
    if (gate && gate.type === 'CNOT') {
        const isControl = gate.controlQubit === qubit;
        const isTarget = gate.targetQubit === qubit;
        const isBetween = (qubit > Math.min(gate.controlQubit, gate.targetQubit) && qubit < Math.max(gate.controlQubit, gate.targetQubit));

        if (isControl || isTarget || isBetween) {
            cnotLineStyle.backgroundColor = '#4A90E2'; // blue-500
            if (isControl || isTarget) {
                 cnotLineStyle.height = 'calc(50% + 2px)';
                 if (qubit > gate.targetQubit) cnotLineStyle.top = '0'; else cnotLineStyle.bottom = '0';
            } else { // between
                 cnotLineStyle.height = '100%';
            }
        }
    }


    const cellContent = () => {
        if (gate) {
            if (gate.type === 'CNOT') {
                if (gate.controlQubit === qubit) {
                    return <div className="w-4 h-4 bg-blue-600 rounded-full z-10" />; // 제어점
                }
                if (gate.targetQubit === qubit) {
                    return (
                        <div className="relative w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center bg-gray-100 z-10"
                             onClick={() => onRemoveGate(gate.id)}>
                            <span className="text-blue-600 text-2xl font-bold leading-none mb-1">+</span>
                        </div>
                    ); // 타겟(⊕)
                }
            } else {
                return <Gate gate={gate} onRemove={onRemoveGate} availableGates={availableGates} />;
            }
        }
        return null;
    }

    return (
        <div
            onDragOver={(e) => handleDragOver(e, qubit, step)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, qubit, step)}
            className={`w-20 h-20 flex items-center justify-center transition-colors relative`}
        >
          {/* CNOT 연결선 */}
          { Object.keys(cnotLineStyle).length > 0 && 
            <div className="absolute w-1" style={{...cnotLineStyle, left: '50%', transform: 'translateX(-50%)', zIndex: 0}} />
          }
          {/* 게이트가 놓일 슬롯 */}
          <div className={`w-14 h-14 rounded-full border-2 border-dashed  flex items-center justify-center transition-all duration-200
            ${isDragOver ? 'bg-green-200 border-green-400' : 'bg-gray-200/50 border-gray-400'}`}>
            {cellContent()}
          </div>
        </div>
    );
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
      {Array.from({ length: numQubits }).map((_, qubit) => (
        <div key={qubit} className="flex items-center mb-1">
          <div className="w-16 text-center font-bold text-lg text-gray-700">Q<sub>{qubit}</sub></div>
          <div className="flex-1 h-0.5 bg-gray-500 relative flex items-center">
            {Array.from({ length: numSteps }).map((_, step) => (
                <div key={step} className="absolute" style={{ left: `${(step / (numSteps -1)) * 100}%`, transform: 'translateX(-50%)' }}>
                    {renderGridCell(qubit, step)}
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const GatePalette = ({ availableGates, onDragStart }) => (
    <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Quantum Gates</h3>
        <div className="grid grid-cols-3 gap-3">
            {availableGates.map((gate) => (
                <div
                    key={gate.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, gate.type)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-grab ${gate.color} text-white shadow-lg transition-transform transform hover:scale-105 aspect-square`}
                >
                    <div className="text-2xl font-bold">{gate.symbol}</div>
                    <div className="text-xs font-semibold">{gate.name}</div>
                </div>
            ))}
        </div>
    </div>
);

export { CircuitGrid, GatePalette }; 