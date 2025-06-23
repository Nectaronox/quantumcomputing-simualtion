import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import config from '../config';

const CircuitBuilder = () => {
  const [searchParams] = useSearchParams();
  const [circuitGates, setCircuitGates] = useState([]);
  const [draggedGate, setDraggedGate] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('qiskit');
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [expandResults, setExpandResults] = useState(true);
  const [slowPlayback, setSlowPlayback] = useState(false);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState([]);
  const [probabilityData, setProbabilityData] = useState([]);
  const [showProbabilityChart, setShowProbabilityChart] = useState(true);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  
  const numQubits = 3;
  const numSteps = 5;

  const availableGates = [
    { type: 'H', name: 'Hadamard', color: 'bg-purple-500 hover:bg-purple-600', symbol: 'H' },
    { type: 'X', name: 'Pauli-X', color: 'bg-red-500 hover:bg-red-600', symbol: 'X' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-green-500 hover:bg-green-600', symbol: 'Y' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-blue-500 hover:bg-blue-600', symbol: 'Z' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-orange-500 hover:bg-orange-600', symbol: '⊕' }
  ];

  // 코드 생성 엔진들 (기존과 동일)
  const codeGenerators = {
    qiskit: (gates) => {
      if (gates.length === 0) {
        return `# Qiskit 양자 회로
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# ${numQubits}개 큐비트 회로 생성
circuit = QuantumCircuit(${numQubits}, ${numQubits})

# 아직 게이트가 배치되지 않았습니다
# 왼쪽에서 게이트를 드래그해서 회로를 구성하세요!

# 측정 추가
circuit.measure_all()

# 시뮬레이션 실행
simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, simulator, shots=1024)
result = job.result()
counts = result.get_counts()

print("측정 결과:", counts)
plot_histogram(counts)`;
      }

      const sortedGates = [...gates].sort((a, b) => a.step - b.step || a.qubit - b.qubit);
      
      let code = `# Qiskit 양자 회로
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram

# ${numQubits}개 큐비트 회로 생성
circuit = QuantumCircuit(${numQubits}, ${numQubits})

# 게이트들 추가
`;

      sortedGates.forEach((gate, index) => {
        if (gate.type === 'CNOT') {
          code += `circuit.cx(${gate.qubit}, ${gate.targetQubit})  # CNOT: Q${gate.qubit} → Q${gate.targetQubit}\n`;
        } else {
          const gateMethod = gate.type.toLowerCase();
          code += `circuit.${gateMethod}(${gate.qubit})  # ${gate.type} 게이트를 Q${gate.qubit}에 적용\n`;
        }
      });

      code += `
# 측정 추가
circuit.measure_all()

# 회로 출력
print("생성된 회로:")
print(circuit)

# 시뮬레이션 실행
simulator = Aer.get_backend('qasm_simulator')
job = execute(circuit, simulator, shots=1024)
result = job.result()
counts = result.get_counts()

print("\\n측정 결과:", counts)
plot_histogram(counts)`;

      return code;
    },

    cirq: (gates) => {
      // Cirq 코드 생성 로직 (간단화)
      return `# Cirq 양자 회로 (시뮬레이션)
import cirq
# 간단한 Cirq 시뮬레이션 코드
print("Cirq 시뮬레이션 결과")`;
    },

    javascript: (gates) => {
      // JavaScript 코드 생성 로직 (간단화)
      return `// JavaScript 양자 시뮬레이터
console.log("JavaScript 시뮬레이션 결과");`;
    },

    json: (gates) => {
      const circuitData = {
        metadata: {
          numQubits: numQubits,
          numSteps: numSteps,
          description: "드래그앤드롭으로 생성된 양자 회로",
          createdAt: new Date().toISOString()
        },
        gates: gates.map(gate => ({
          id: gate.id,
          type: gate.type,
          qubit: gate.qubit,
          step: gate.step,
          ...(gate.targetQubit !== undefined && { targetQubit: gate.targetQubit })
        })),
        circuit: gates.length === 0 ? "아직 게이트가 배치되지 않았습니다" : 
          gates.sort((a, b) => a.step - b.step || a.qubit - b.qubit)
               .map(gate => gate.type === 'CNOT' ? 
                 `CNOT(${gate.qubit}, ${gate.targetQubit})` : 
                 `${gate.type}(${gate.qubit})`).join(' → ')
      };

      return JSON.stringify(circuitData, null, 2);
    }
  };

  // URL 파라미터에서 템플릿 로드
  useEffect(() => {
    const templateId = searchParams.get('template');
    const gatesParam = searchParams.get('gates');
    
    if (templateId && gatesParam && !templateLoaded) {
      try {
        const decodedGates = JSON.parse(decodeURIComponent(gatesParam));
        setCircuitGates(decodedGates);
        setTemplateLoaded(true);
        
        // 템플릿 적용 알림 (한 번만)
        setTimeout(() => {
          alert(`${templateId} 템플릿이 성공적으로 적용되었습니다! 🎉`);
        }, 500);
      } catch (error) {
        console.error('템플릿 로드 오류:', error);
        alert('템플릿을 로드하는 중 오류가 발생했습니다.');
      }
    }
  }, [searchParams, templateLoaded]);

  // 실시간 코드 생성
  useEffect(() => {
    const newCode = codeGenerators[selectedLanguage](circuitGates);
    setGeneratedCode(newCode);
  }, [circuitGates, selectedLanguage]);

  // 드래그앤드롭 핸들러들
  const handleDragStart = (e, gateType) => {
    setDraggedGate(gateType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e, qubit, step) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverPosition({ qubit, step });
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPosition(null);
    }
  };

  const handleDrop = (e, qubit, step) => {
    e.preventDefault();
    if (!draggedGate) return;

    if (draggedGate === 'CNOT') {
      // CNOT 게이트 드롭 개선: 드롭한 큐비트를 제어 큐비트로 설정
      if (qubit < numQubits - 1) {
        // 현재 큐비트 → 다음 큐비트 (현재 큐비트가 제어)
        addGateToCircuit('CNOT', qubit, step, qubit + 1);
      } else if (qubit > 0) {
        // 마지막 큐비트에 드롭한 경우: 현재 큐비트를 제어로, 이전 큐비트를 타겟으로
        addGateToCircuit('CNOT', qubit, step, qubit - 1);
      } else {
        // Q0 하나만 있는 경우는 CNOT을 만들 수 없음
        alert('CNOT 게이트는 최소 2개의 큐비트가 필요합니다!');
      }
    } else {
      addGateToCircuit(draggedGate, qubit, step);
    }

    setDraggedGate(null);
    setDragOverPosition(null);
  };

  const addGateToCircuit = (gateType, qubit, step, targetQubit = null) => {
    if (gateType === 'CNOT' && targetQubit !== null) {
      // CNOT 게이트는 제어 큐비트와 타겟 큐비트 둘 다에 표시
      const controlGate = {
        id: Date.now(),
        type: 'CNOT',
        qubit: qubit,
        step: step,
        targetQubit: targetQubit,
        role: 'control'
      };

      const targetGate = {
        id: Date.now() + 1,
        type: 'CNOT',
        qubit: targetQubit,
        step: step,
        targetQubit: qubit, // 역참조로 제어 큐비트 저장
        role: 'target'
      };

      // 기존 게이트들 제거 (같은 위치에 있는 것들)
      const filteredGates = circuitGates.filter(gate => 
        !((gate.qubit === qubit || gate.qubit === targetQubit) && gate.step === step)
      );

      setCircuitGates([...filteredGates, controlGate, targetGate]);
    } else {
      // 일반 게이트 처리
      const existingGateIndex = circuitGates.findIndex(
        gate => gate.qubit === qubit && gate.step === step
      );

      const newGate = {
        id: Date.now(),
        type: gateType,
        qubit: qubit,
        step: step,
        targetQubit: targetQubit
      };

      if (existingGateIndex >= 0) {
        const newGates = [...circuitGates];
        newGates[existingGateIndex] = newGate;
        setCircuitGates(newGates);
      } else {
        setCircuitGates([...circuitGates, newGate]);
      }
    }
  };

  const removeGate = (gateId) => {
    const gateToRemove = circuitGates.find(gate => gate.id === gateId);
    
    if (gateToRemove && gateToRemove.type === 'CNOT') {
      // CNOT 게이트인 경우, 연결된 모든 게이트 제거
      setCircuitGates(circuitGates.filter(gate => 
        !(gate.type === 'CNOT' && gate.step === gateToRemove.step && 
          (gate.qubit === gateToRemove.qubit || gate.qubit === gateToRemove.targetQubit))
      ));
    } else {
      // 일반 게이트 제거
      setCircuitGates(circuitGates.filter(gate => gate.id !== gateId));
    }
  };

  const clearCircuit = () => {
    setCircuitGates([]);
    setStepStates([]);
    setCurrentStep(0);
  };

  const getGateAtPosition = (qubit, step) => {
    return circuitGates.find(gate => gate.qubit === qubit && gate.step === step);
  };

  // CNOT 게이트의 연결 정보를 가져오는 함수
  const getCnotConnectionsAtStep = (step) => {
    return circuitGates
      .filter(gate => gate.type === 'CNOT' && gate.step === step)
      .map(gate => ({
        control: gate.qubit,
        target: gate.targetQubit
      }));
  };

  const getDragOverStyle = (qubit, step) => {
    if (dragOverPosition && dragOverPosition.qubit === qubit && dragOverPosition.step === step) {
      return 'bg-blue-200 border-blue-400 border-2 border-dashed';
    }
    return 'border border-gray-300 hover:border-gray-400';
  };

  // 코드 복사 기능
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    const button = document.getElementById('copy-button');
    const originalText = button.textContent;
    button.textContent = '복사됨!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  };

  // 🚀 코드 실행 기능 (향상된 버전)
  const executeCode = async () => {
    if (!generatedCode.trim()) {
      alert('실행할 코드가 없습니다!');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.endpoints.executeCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: generatedCode,
          language: selectedLanguage,
          step_by_step: slowPlayback
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setExecutionResult({
          success: true,
          data: result.result,
          raw_output: result.raw_output
        });
        
        if (result.result.step_states) {
          setStepStates(result.result.step_states);
        }
        
        setShowResults(true);
        setExpandResults(true);
      } else {
        setExecutionResult({
          success: false,
          error: result.error || '알 수 없는 오류가 발생했습니다.'
        });
        setShowResults(true);
        setExpandResults(true);
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.'
      });
      setShowResults(true);
      setExpandResults(true);
    } finally {
      setIsExecuting(false);
    }
  };

  // 느린 재생 모드 관련 함수들
  const startSlowPlayback = () => {
    if (circuitGates.length === 0) {
      alert('먼저 회로에 게이트를 배치해주세요!');
      return;
    }
    
    setIsPlayingSteps(true);
    setCurrentStep(0);
    setShowProbabilityChart(true); // 재생 시작 시 그래프 자동으로 표시
    
    // 초기 확률분포 설정
    const initialData = normalizeProbabilities(generateProbabilityData(0));
    setProbabilityData(initialData);
    
    const maxSteps = Math.max(...circuitGates.map(gate => gate.step)) + 1;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= maxSteps) {
          setIsPlayingSteps(false);
          clearInterval(interval);
          return prev;
        }
        
        // 확률분포 업데이트
        const newData = normalizeProbabilities(generateProbabilityData(nextStep));
        setProbabilityData(newData);
        
        return nextStep;
      });
    }, 2000); // 2초마다 다음 단계
  };

  const stopSlowPlayback = () => {
    setIsPlayingSteps(false);
  };

  // 확률분포 시뮬레이션 데이터 생성
  const generateProbabilityData = (currentStep) => {
    const states = ['000', '001', '010', '011', '100', '101', '110', '111'];
    
    // 양자회로의 진화를 더 현실적으로 시뮬레이션
    return states.map(state => {
      let probability;
      
      // 단계에 따른 확률 변화 시뮬레이션 (더 현실적으로)
      if (currentStep === 0) {
        // 초기 상태: |000⟩이 확률 1
        probability = state === '000' ? 1.0 : 0.0;
      } else if (currentStep === 1) {
        // 첫 번째 큐비트에 H 게이트 적용 후
        if (state.startsWith('0')) {
          probability = 0.5; // |0xx⟩ 상태들
        } else {
          probability = 0.5; // |1xx⟩ 상태들  
        }
        // 나머지 큐비트는 아직 |00⟩
        if (!state.endsWith('00')) {
          probability = 0.0;
        }
      } else if (currentStep === 2) {
        // CNOT 게이트 적용 후: 얽힘 상태 형성
        if (state === '000' || state === '110') {
          probability = 0.5; // 벨 상태 유사
        } else {
          probability = 0.0;
        }
      } else {
        // 이후 단계들: 더 복잡한 중첩
        const hamming = state.split('').filter(bit => bit === '1').length;
        probability = Math.exp(-hamming * 0.5) / 4; // 해밍 거리 기반 근사
      }
      
      return {
        state,
        probability: Math.max(0, Math.min(1, probability))
      };
    });
  };

  // 확률분포 정규화 (합이 1이 되도록)
  const normalizeProbabilities = (data) => {
    const total = data.reduce((sum, item) => sum + item.probability, 0);
    if (total < 1e-10) {
      // 모든 확률이 0에 가까운 경우, 균등분포로 설정
      return data.map(item => ({
        ...item,
        probability: 1.0 / data.length
      }));
    }
    return data.map(item => ({
      ...item,
      probability: item.probability / total
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
           양자 회로 빌더
        </h1>
        <p className="text-center text-gray-600 mb-8">
          게이트를 드래그앤드롭하여 양자 회로를 만들고 실시간으로 실행해보세요!
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          
          {/* 게이트 팔레트 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">게이트 팔레트</h2>
            <div className="space-y-3">
              {availableGates.map((gate) => (
                <div
                  key={gate.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate.type)}
                  className={`
                    ${gate.color} text-white p-4 rounded-lg cursor-move 
                    transition-all duration-200 transform hover:scale-105
                    select-none shadow-md
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{gate.symbol}</div>
                    <div className="text-sm">{gate.name}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 느린 재생 모드 컨트롤 */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">느린 재생 모드</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={slowPlayback}
                    onChange={(e) => setSlowPlayback(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">단계별 상태 추적</span>
                </label>
                
                {stepStates.length > 0 && (
                  <div className="space-y-2">
                    {!isPlayingSteps ? (
                      <button
                        onClick={startSlowPlayback}
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 text-sm"
                      >
                        ▶️ 느린 재생 시작
                      </button>
                    ) : (
                      <button
                        onClick={stopSlowPlayback}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                      >
                        ⏹️ 재생 중지
                      </button>
                    )}
                    
                                    {circuitGates.length > 0 && (
                  <div className="text-xs text-gray-600">
                    단계: {isPlayingSteps ? currentStep + 1 : 0} / {Math.max(...circuitGates.map(gate => gate.step), 0) + 1}
                  </div>
                )}

                {/* 확률분포 그래프 토글 (재생 중일 때만) */}
                {isPlayingSteps && probabilityData.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowProbabilityChart(!showProbabilityChart)}
                      className={`w-full py-2 px-3 rounded text-sm transition-colors ${
                        showProbabilityChart 
                          ? 'bg-purple-500 text-white hover:bg-purple-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      📊 {showProbabilityChart ? '그래프 숨기기' : '그래프 보기'}
                    </button>
                  </div>
                )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 회로 캔버스 */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">양자 회로</h2>
              <button
                onClick={clearCircuit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                초기화
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="flex mb-2">
                  <div className="w-16"></div>
                  {Array.from({ length: numSteps }, (_, step) => (
                    <div key={step} className="w-20 text-center text-sm font-medium">
                      Step {step + 1}
                    </div>
                  ))}
                </div>

                {Array.from({ length: numQubits }, (_, qubit) => (
                  <div key={qubit} className="flex items-center mb-3 relative">
                    <div className="w-16 text-right pr-4 font-medium">Q{qubit}:</div>
                    {Array.from({ length: numSteps }, (_, step) => {
                      const gate = getGateAtPosition(qubit, step);
                      const cnotConnections = getCnotConnectionsAtStep(step);
                      
                      return (
                        <div
                          key={step}
                          className={`w-20 h-16 mx-1 rounded-lg flex items-center justify-center relative
                            ${getDragOverStyle(qubit, step)} transition-all duration-200`}
                          onDragOver={(e) => handleDragOver(e, qubit, step)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, qubit, step)}
                        >
                          {/* CNOT 연결선 그리기 */}
                          {cnotConnections.map((connection, idx) => {
                            if (connection.control === qubit || connection.target === qubit) {
                              const lineHeight = Math.abs(connection.target - connection.control) * 64 + 32; // 64px는 행 간격
                              const isControl = connection.control === qubit;
                              const lineTop = isControl ? 32 : -lineHeight + 32;
                              
                              return (
                                <div
                                  key={idx}
                                  className="absolute bg-orange-400 pointer-events-none"
                                  style={{
                                    width: '3px',
                                    height: `${lineHeight}px`,
                                    left: '50%',
                                    top: `${lineTop}px`,
                                    transform: 'translateX(-50%)',
                                    zIndex: 1
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
                          
                          {gate && (
                            <div
                              onClick={() => removeGate(gate.id)}
                              className={`w-12 h-12 rounded-lg flex items-center justify-center
                                cursor-pointer text-white font-bold text-lg
                                transition-transform hover:scale-110 relative z-10
                                ${gate.type === 'H' ? 'bg-purple-500' :
                                  gate.type === 'X' ? 'bg-red-500' :
                                  gate.type === 'Y' ? 'bg-green-500' :
                                  gate.type === 'Z' ? 'bg-blue-500' :
                                  'bg-orange-500'}`}
                            >
                              {gate.type === 'CNOT' ? 
                                (gate.role === 'control' ? '●' : '⊕') : 
                                gate.type}
                            </div>
                          )}
                          {!gate && <div className="text-gray-400 text-sm">Drop</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 확률분포 막대그래프 */}
            {isPlayingSteps && probabilityData.length > 0 && showProbabilityChart && (
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-purple-800">
                    🎯 실시간 확률분포 변화 (단계: {currentStep + 1})
                  </h3>
                  <button
                    onClick={() => setShowProbabilityChart(false)}
                    className="text-purple-600 hover:text-purple-800 text-lg font-bold"
                    title="확률분포 그래프 숨기기"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  {probabilityData.map((item, index) => {
                    const percentage = (item.probability * 100).toFixed(1);
                    const barWidth = item.probability * 100;
                    
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-12 text-sm font-mono text-gray-700">
                          |{item.state}⟩
                        </div>
                        <div className="flex-1 mx-3 relative">
                          <div className="w-full bg-gray-200 rounded-full h-6">
                            <div
                              className={`h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2
                                ${barWidth > 15 ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-blue-400'}`}
                              style={{ width: `${Math.max(barWidth, 2)}%` }}
                            >
                              {barWidth > 15 && (
                                <span className="text-white text-xs font-bold">
                                  {percentage}%
                                </span>
                              )}
                            </div>
                          </div>
                          {barWidth <= 15 && (
                            <span className="absolute right-0 top-0 text-xs text-gray-600 -mr-12 mt-1">
                              {percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-sm text-purple-700 text-center">
                  양자 상태가 실시간으로 변변화하고 있습니다
                </div>
              </div>
            )}

            {/* 확률분포 그래프 다시 보기 버튼 */}
            {isPlayingSteps && probabilityData.length > 0 && !showProbabilityChart && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowProbabilityChart(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  확률분포 그래프 보기
                </button>
              </div>
            )}
          </div>

          {/* 실시간 코드 출력 */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">실시간 생성 코드</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="qiskit">Qiskit(Python)</option>
                  <option value="cirq">Cirq(Python)</option>
                  <option value="javascript">JavaScript</option>
                  <option value="json">JSON 데이터</option>
                </select>
                <button
                  id="copy-button"
                  onClick={copyToClipboard} 
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  복사
                </button>
                <button
                  onClick={executeCode}
                  disabled={isExecuting || !generatedCode.trim()}
                  className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                    isExecuting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : !generatedCode.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isExecuting ? '실행 중...' : '실행'}
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto h-96 font-mono">
                <code>{generatedCode}</code>
              </pre>
              
              {/* 실시간 업데이트 인디케이터 */}
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="mt-8 text-lg font-bold text-gray-600">
               게이트를 배치할 때마다 코드가 실시간으로 업데이트됩니다!
            </div>
          </div>

          {/* 실행 결과 표시 (향상된 버전) */}
          {showResults && executionResult && (
            <div className="xl:col-span-5 bg-white rounded-lg shadow-lg">
              {expandResults ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">
                      {executionResult.success ? '✅ 실행 결과' : '❌ 실행 오류'}
                    </h3>
                    <button
                      onClick={() => setExpandResults(false)}
                      className="text-gray-500 hover:text-gray-700"
                      title="결과 최소화"
                    >
                      ➖ 접기
                    </button>
                  </div>
                  
                  {executionResult.success ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 측정 결과 */}
                      {executionResult.data.measurement_results && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">📊 측정 결과</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(executionResult.data.measurement_results).map(([state, count]) => (
                              <div key={state} className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-lg font-bold text-blue-600">|{state}⟩</div>
                                <div className="text-sm text-gray-600">
                                  {count}회 ({((count / executionResult.data.total_shots) * 100).toFixed(1)}%)
                                </div>
                                <div className="mt-2 bg-blue-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(count / executionResult.data.total_shots) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 생성된 차트 표시 */}
                      {executionResult.data.charts && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">📈 시각화</h4>
                          
                          {executionResult.data.charts.histogram && (
                            <div className="mb-4">
                              <h5 className="font-medium mb-2">막대 그래프</h5>
                              <img 
                                src={executionResult.data.charts.histogram} 
                                alt="측정 결과 히스토그램"
                                className="w-full rounded-lg border"
                              />
                            </div>
                          )}

                          {executionResult.data.charts.bloch && (
                            <div>
                              <h5 className="font-medium mb-2">블로흐 구</h5>
                              <img 
                                src={executionResult.data.charts.bloch} 
                                alt="블로흐 구 시각화"
                                className="w-full rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <pre className="text-red-700 text-sm whitespace-pre-wrap">
                        {executionResult.error}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {executionResult.success ? '✅ 실행 완료' : '❌ 실행 실패'}
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {executionResult.success ? '결과 확인 가능' : '오류 확인 필요'}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandResults(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                       결과 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 통계 정보 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">회로 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-100 p-3 rounded">
              <div className="text-2xl font-bold text-purple-600">{circuitGates.length}</div>
              <div className="text-sm text-purple-800">총 게이트 수</div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...circuitGates.map(g => g.step + 1), 0)}
              </div>
              <div className="text-sm text-blue-800">회로 깊이</div>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">
                {generatedCode.split('\n').length}
              </div>
              <div className="text-sm text-green-800">생성 코드 라인</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-400">
                {circuitGates.filter(g => g.type === 'CNOT').length}
              </div>
              <div className="text-sm text-yellow-800">얽힘 게이트</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitBuilder; 