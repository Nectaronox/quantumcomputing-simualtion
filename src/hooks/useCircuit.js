import { useReducer, useCallback } from 'react';

const initialState = {
  gates: [], // CNOT를 하나의 객체로 관리: { id, type, controlQubit, targetQubit, step }
  numQubits: 3,
  numSteps: 5,
};

const circuitReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_GATE': {
      const { gateType, qubit, step } = action.payload;
      const newGateBase = { id: Date.now(), step };
      let newGates = [...state.gates];

      // 같은 위치에 있는 기존 게이트 제거
      newGates = newGates.filter(g => !(g.step === step && (g.controlQubit === qubit || g.targetQubit === qubit || g.qubit === qubit)));

      if (gateType === 'CNOT') {
        if (qubit < state.numQubits -1) {
            newGates.push({ ...newGateBase, type: 'CNOT', controlQubit: qubit, targetQubit: qubit + 1 });
        } else {
             // 마지막 큐비트에 드롭 시, 이전 큐비트를 타겟으로
            newGates.push({ ...newGateBase, type: 'CNOT', controlQubit: qubit, targetQubit: qubit - 1 });
        }
      } else {
        newGates.push({ ...newGateBase, type: gateType, qubit });
      }
      return { ...state, gates: newGates };
    }
    case 'REMOVE_GATE': {
        const { gateId } = action.payload;
        const gateToRemove = state.gates.find(g => g.id === gateId);
        if (!gateToRemove) return state;

        let newGates;
        if (gateToRemove.type === 'CNOT') {
            // CNOT는 id로 바로 제거 가능
             newGates = state.gates.filter(g => g.id !== gateId);
        } else {
            // 일반 게이트
            newGates = state.gates.filter(g => g.id !== gateId);
        }
        return { ...state, gates: newGates };
    }
    case 'MOVE_GATE': {
      const { gateId, newQubit, newStep } = action.payload;
      return {
        ...state,
        gates: state.gates.map(gate => 
          gate.id === gateId 
            ? { ...gate, qubit: newQubit, step: newStep }
            : gate
        )
      };
    }
    case 'SET_NUM_QUBITS': {
      return { ...state, numQubits: action.payload.numQubits, gates: [] };
    }
    case 'RESET_CIRCUIT': {
      const { numQubits } = action.payload;
      return { 
        ...state, 
        gates: [], 
        numQubits: numQubits !== undefined ? numQubits : state.numQubits 
      };
    }
    case 'SET_CIRCUIT': {
      const { gates, numQubits } = action.payload;
      return { 
        ...state, 
        gates: gates || [], 
        numQubits: numQubits !== undefined ? numQubits : state.numQubits 
      };
    }
    case 'CLEAR_CIRCUIT':
      return { ...state, gates: [] };
    case 'LOAD_GATES':
        return { ...state, gates: action.payload.gates };
    default:
      return state;
  }
};

export const useCircuit = () => {
  const [state, dispatch] = useReducer(circuitReducer, initialState);

  const addGate = useCallback((gateType, qubit, step) => {
    dispatch({ type: 'ADD_GATE', payload: { gateType, qubit, step } });
  }, []);

  const removeGate = useCallback((gateId) => {
    dispatch({ type: 'REMOVE_GATE', payload: { gateId } });
  }, []);

  const moveGate = useCallback((gateId, newQubit, newStep) => {
    dispatch({ type: 'MOVE_GATE', payload: { gateId, newQubit, newStep } });
  }, []);

  const setNumQubits = useCallback((numQubits) => {
    dispatch({ type: 'SET_NUM_QUBITS', payload: { numQubits } });
  }, []);

  const resetCircuit = useCallback((numQubits) => {
    dispatch({ type: 'RESET_CIRCUIT', payload: { numQubits } });
  }, []);

  const setCircuit = useCallback((circuitData) => {
    dispatch({ type: 'SET_CIRCUIT', payload: circuitData });
  }, []);

  const clearCircuit = useCallback(() => {
    dispatch({ type: 'CLEAR_CIRCUIT' });
  }, []);
  
  const loadGates = useCallback((gates) => {
      dispatch({ type: 'LOAD_GATES', payload: { gates } });
  }, []);

  const generatePythonCode = useCallback((gates) => {
    if (!gates || gates.length === 0) {
      return '# 양자 회로가 비어있습니다.';
    }

    let code = '# 생성된 양자 회로 코드 (순수 파이썬 시뮬레이터)\n';
    code += 'from quantum_simulator import PureQuantumSimulator\n\n';
    code += `# ${state.numQubits}개 큐비트 시뮬레이터 생성\n`;
    code += `simulator = PureQuantumSimulator(${state.numQubits})\n\n`;

    // 게이트를 step 순서대로 정렬
    const sortedGates = [...gates].sort((a, b) => a.step - b.step);

    code += '# 양자 게이트 적용\n';
    sortedGates.forEach(gate => {
      if (gate.type === 'CNOT') {
        code += `simulator.apply_cnot(${gate.controlQubit}, ${gate.targetQubit})\n`;
      } else if (gate.type === 'H') {
        code += `simulator.apply_hadamard(${gate.qubit})\n`;
      } else if (gate.type === 'X') {
        code += `simulator.apply_pauli_x(${gate.qubit})\n`;
      } else if (gate.type === 'Y') {
        code += `simulator.apply_pauli_y(${gate.qubit})\n`;
      } else if (gate.type === 'Z') {
        code += `simulator.apply_pauli_z(${gate.qubit})\n`;
      }
    });

    code += '\n# 시뮬레이션 실행 및 측정\n';
    code += 'results = simulator.measure_all(shots=1024)\n';
    code += 'print("측정 결과:", results)\n';

    return code;
  }, [state.numQubits]);

  return {
    circuit: { gates: state.gates, numQubits: state.numQubits },
    numQubits: state.numQubits,
    addGate,
    moveGate,
    removeGate,
    setNumQubits,
    resetCircuit,
    setCircuit,
    clearCircuit,
    loadGates,
    generatePythonCode,
  };
}; 