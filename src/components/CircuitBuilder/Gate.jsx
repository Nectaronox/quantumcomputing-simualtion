import React from 'react';

const Gate = ({ gate, onRemove, availableGates }) => {
  const gateInfo = availableGates.find(g => g.type === gate.type);
  const gateStyle = gateInfo ? gateInfo.color : 'bg-gray-400';
  
  const handleRemove = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onRemove(gate.id);
  };

  if (gate.type === 'CNOT') {
    // CNOT는 Gate 컴포넌트에서 직접 렌더링하지 않고,
    // CircuitGrid에서 제어점과 타겟을 한 번에 그립니다.
    // 따라서 이 컴포넌트는 CNOT가 아닌 단일 게이트만 처리합니다.
    return null; 
  }

  return (
    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-lg cursor-pointer transition-transform transform hover:scale-110 ${gateStyle}`}>
      {gateInfo.symbol}
      <button 
        onClick={handleRemove}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
        aria-label="Remove gate"
      >
        X
      </button>
    </div>
  );
};

export default Gate; 