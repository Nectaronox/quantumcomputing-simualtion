import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import { QuantumSimulator } from './QuantumSimulator';
import ResultVisualization from './ResultVisualization';
import QuantumInfoPanel from './QuantumInfoPanel';
import StepControls from './StepControls';
import CNOTModal from './CNOTModal';


const MainContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 32px;
  font-size: 1.1rem;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 400px;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GatePalette = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const CircuitCanvas = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
  
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const GateButton = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 16px;
  border-radius: 8px;
  cursor: move;
  text-align: center;
  margin-bottom: 12px;
  transition: all 0.2s;
  user-select: none;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CircuitGrid = styled.div`
  overflow-x: auto;
  padding-bottom: 16px;
`;

const CircuitRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  min-width: 600px;
`;

const QubitLabel = styled.div`
  width: 60px;
  text-align: right;
  padding-right: 16px;
  font-weight: 500;
  color: #374151;
`;

const GateSlot = styled.div`
  width: 80px;
  height: 60px;
  margin: 0 4px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: ${props => props.dragOver ? '#e0e7ff' : 'transparent'};
  border-color: ${props => props.dragOver ? '#3b82f6' : '#d1d5db'};
  position: relative;
`;

const PlacedGate = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const CNOTConnection = styled.div`
  position: absolute;
  width: 2px;
  background: #f59e0b;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const ControlButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ClearButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #dc2626;
  }
`;

const AlgorithmBanner = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

const AlgorithmInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AlgorithmName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const AlgorithmSubtext = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const DismissButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

/**
 * 향상된 양자 회로 빌더 컴포넌트
 * CNOT 게이트 개선, 결과 표시 수정, 에러 처리 포함
 */
const CircuitBuilder = () => {
  // 기본 회로 설정
  const numQubits = 3;
  const numSteps = 6;

  // 상태 관리
  const [circuitGates, setCircuitGates] = useState([]);
  const [draggedGate, setDraggedGate] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  
  // CNOT 모달 상태
  const [cnotModalOpen, setCnotModalOpen] = useState(false);
  const [pendingCnotPosition, setPendingCnotPosition] = useState(null);
  
  // 시뮬레이션 상태
  const [simulator] = useState(() => new QuantumSimulator(numQubits));
  const [simulationResult, setSimulationResult] = useState(null);
  const [stepResults, setStepResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [runStatus, setRunStatus] = useState('idle');
  const [stepSpeed, setStepSpeed] = useState(800);
  const [isPaused, setIsPaused] = useState(false);
  
  // 실행 제어
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);

  // 로드된 알고리즘 정보
  const [loadedAlgorithm, setLoadedAlgorithm] = useState(null);

  // 사용 가능한 게이트들
  const availableGates = [
    { type: 'H', name: 'Hadamard', color: '#8b5cf6', symbol: 'H' },
    { type: 'X', name: 'Pauli-X', color: '#ef4444', symbol: 'X' },
    { type: 'Y', name: 'Pauli-Y', color: '#10b981', symbol: 'Y' },
    { type: 'Z', name: 'Pauli-Z', color: '#3b82f6', symbol: 'Z' },
    { type: 'CNOT', name: 'CNOT', color: '#f59e0b', symbol: '⊕' }
  ];

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

    // CNOT 게이트인 경우 모달 열기
    if (draggedGate === 'CNOT') {
      // 해당 스텝에 이미 있는 게이트들 확인
      const occupiedQubits = circuitGates
        .filter(gate => gate.step === step)
        .map(gate => gate.qubit);
      
      setPendingCnotPosition({ step });
      setCnotModalOpen(true);
    } else {
      // 일반 게이트는 바로 추가
      addGateToCircuit(draggedGate, qubit, step);
    }

    setDraggedGate(null);
    setDragOverPosition(null);
  };

  // CNOT 게이트 확인 핸들러
  const handleCnotConfirm = (controlQubit, targetQubit) => {
    if (pendingCnotPosition) {
      addGateToCircuit('CNOT', controlQubit, pendingCnotPosition.step, targetQubit);
      setPendingCnotPosition(null);
      toast.success(`CNOT 게이트가 Q${controlQubit} → Q${targetQubit}로 추가되었습니다.`);
    }
  };

  const addGateToCircuit = (gateType, qubit, step, targetQubit = null) => {
    // 기존 게이트 존재 여부 확인
    const existingGateIndex = circuitGates.findIndex(
      gate => gate.qubit === qubit && gate.step === step
    );
    
    // CNOT의 경우 타깃 큐비트에도 게이트가 있는지 확인
    if (gateType === 'CNOT' && targetQubit !== null) {
      const targetGateExists = circuitGates.some(
        gate => gate.qubit === targetQubit && gate.step === step
      );
      
      if (targetGateExists) {
        toast.error(`Q${targetQubit}에 이미 게이트가 있습니다.`);
        return;
      }
    }

    const newGate = {
      id: Date.now() + Math.random(),
      type: gateType,
      qubit: qubit,
      step: step,
      targetQubit: targetQubit
    };

    if (existingGateIndex >= 0) {
      const newGates = [...circuitGates];
      newGates[existingGateIndex] = newGate;
      setCircuitGates(newGates);
      toast.success('게이트가 교체되었습니다.');
    } else {
      setCircuitGates([...circuitGates, newGate]);
      if (gateType !== 'CNOT') {
        toast.success(`${gateType} 게이트가 Q${qubit}에 추가되었습니다.`);
      }
    }
  };

  const removeGate = (gateId) => {
    const gateToRemove = circuitGates.find(gate => gate.id === gateId);
    if (gateToRemove) {
      setCircuitGates(circuitGates.filter(gate => gate.id !== gateId));
      toast.success(`${gateToRemove.type} 게이트가 제거되었습니다.`);
    }
  };

  const clearCircuit = () => {
    setCircuitGates([]);
    setSimulationResult(null);
    setStepResults([]);
    setCurrentStep(0);
    setRunStatus('idle');
    setIsPaused(false);
    setLoadedAlgorithm(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast.success('회로가 초기화되었습니다.');
  };

  const getGateAtPosition = (qubit, step) => {
    return circuitGates.find(gate => gate.qubit === qubit && gate.step === step);
  };

  const getGateColor = (gateType) => {
    const gate = availableGates.find(g => g.type === gateType);
    return gate ? gate.color : '#6b7280';
  };

  // 해당 스텝에서 점유된 큐비트 목록 반환
  const getOccupiedQubits = (step) => {
    return circuitGates
      .filter(gate => gate.step === step)
      .flatMap(gate => gate.type === 'CNOT' ? [gate.qubit, gate.targetQubit] : [gate.qubit]);
  };

  // 즉시 실행
  const handleRun = () => {
    if (circuitGates.length === 0) {
      toast.error('실행할 게이트가 없습니다.');
      return;
    }
    
    try {
      setRunStatus('running');
      simulator.reset();
      
      // 게이트를 순서대로 정렬하여 적용
      const sortedGates = [...circuitGates].sort((a, b) => a.step - b.step || a.qubit - b.qubit);
      
      sortedGates.forEach(gate => {
        simulator.applyGate(gate);
      });

      // 측정 결과 생성
      const result = simulator.measure(1024);
      
      if (result && Object.keys(result).length > 0) {
        setSimulationResult(result);
        setRunStatus('completed');
        toast.success('회로 실행이 완료되었습니다!');
      } else {
        toast.error('측정 결과를 생성할 수 없습니다.');
        setRunStatus('idle');
      }
    } catch (error) {
      console.error('시뮬레이션 오류:', error);
      toast.error('시뮬레이션 중 오류가 발생했습니다.');
      setRunStatus('idle');
    }
  };

  // 단계별 실행
  const handleSlowRun = () => {
    if (circuitGates.length === 0) {
      toast.error('실행할 게이트가 없습니다.');
      return;
    }
    
    try {
      setRunStatus('step');
      setIsPaused(false);
      simulator.reset();
      
      // 게이트를 순서대로 정렬
      const sortedGates = [...circuitGates].sort((a, b) => a.step - b.step || a.qubit - b.qubit);
      
      // 초기 상태 저장
      const initialResult = simulator.measure(1024);
      setStepResults([{ step: 0, result: initialResult, gateName: 'Initial' }]);
      setSimulationResult(initialResult);
      
      let stepIndex = 0;
      currentStepRef.current = 0;
      setCurrentStep(0);

      toast.success('단계별 실행을 시작합니다.');

      intervalRef.current = setInterval(() => {
        if (stepIndex >= sortedGates.length) {
          clearInterval(intervalRef.current);
          setRunStatus('completed');
          toast.success('단계별 실행이 완료되었습니다!');
          return;
        }

        const gate = sortedGates[stepIndex];
        simulator.applyGate(gate);
        
        const stepResult = {
          step: stepIndex + 1,
          result: simulator.measure(1024),
          gateName: gate.type,
          gate: gate
        };
        
        setStepResults(prev => [...prev, stepResult]);
        setCurrentStep(stepIndex + 1);
        setSimulationResult(stepResult.result);
        currentStepRef.current = stepIndex + 1;
        
        stepIndex++;
      }, stepSpeed);
    } catch (error) {
      console.error('단계별 시뮬레이션 오류:', error);
      toast.error('단계별 시뮬레이션 중 오류가 발생했습니다.');
      setRunStatus('idle');
    }
  };

  // 실행 정지
  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRunStatus('idle');
    setIsPaused(false);
    toast.info('실행이 중지되었습니다.');
  };

  // 일시정지/재시작
  const handlePause = () => {
    if (runStatus === 'step') {
      if (isPaused) {
        // 재시작
        handleSlowRun();
        setIsPaused(false);
        toast.success('실행이 재시작되었습니다.');
      } else {
        // 일시정지
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsPaused(true);
        toast.info('실행이 일시정지되었습니다.');
      }
    }
  };

  // 스텝 변경 (슬라이더)
  const handleStepChange = (newStep) => {
    if (stepResults.length === 0) return;
    
    setCurrentStep(newStep);
    if (newStep < stepResults.length) {
      setSimulationResult(stepResults[newStep].result);
    }
  };

  // CNOT 연결선 렌더링 도우미
  const renderCNOTConnections = () => {
    return circuitGates
      .filter(gate => gate.type === 'CNOT')
      .map(gate => {
        const controlY = gate.qubit * 72 + 36; // 각 행의 중앙
        const targetY = gate.targetQubit * 72 + 36;
        const x = gate.step * 84 + 125; // 게이트 위치에 맞춘 x 좌표
        
        return (
          <CNOTConnection
            key={`cnot-${gate.id}`}
            style={{
              top: Math.min(controlY, targetY) + 'px',
              left: x + 'px',
              height: Math.abs(targetY - controlY) + 'px'
            }}
          />
        );
      });
  };

  // 알고리즘 템플릿에서 회로 로드
  useEffect(() => {
    const savedAlgorithm = sessionStorage.getItem('selectedAlgorithm');
    if (savedAlgorithm) {
      try {
        const algorithmData = JSON.parse(savedAlgorithm);
        console.log('🔄 알고리즘 템플릿 로드:', algorithmData.name);
        
        // 기존 회로 초기화
        setCircuitGates([]);
        setSimulationResult(null);
        setStepResults([]);
        setCurrentStep(0);
        setRunStatus('idle');
        
        // 새 회로 게이트 설정
        const gatesWithIds = algorithmData.gates.map(gate => ({
          ...gate,
          id: Date.now() + Math.random()
        }));
        
        setCircuitGates(gatesWithIds);
        setLoadedAlgorithm(algorithmData.name);
        
        // 성공 메시지
        toast.success(`${algorithmData.name} 회로가 로드되었습니다!`);
        
        // 세션 스토리지 클리어
        sessionStorage.removeItem('selectedAlgorithm');
      } catch (error) {
        console.error('알고리즘 로드 오류:', error);
        toast.error('알고리즘 회로를 로드하는데 실패했습니다.');
      }
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const totalSteps = circuitGates.length;
  const canRun = circuitGates.length > 0 && runStatus !== 'running' && !isPaused;

  // 현재 스텝 정보 생성
  const currentStepInfo = stepResults.length > currentStep && currentStep > 0 ? {
    current: currentStep,
    total: totalSteps,
    gateName: stepResults[currentStep].gateName
  } : null;

  return (
    <MainContainer>
      <Title>🚀 향상된 양자 회로 시뮬레이터</Title>
      <Subtitle>CNOT 게이트 개선 및 결과 시각화가 포함된 완전한 양자 시뮬레이터!</Subtitle>
      
      {/* 알고리즘 로드 배너 */}
      {loadedAlgorithm && (
        <AlgorithmBanner>
          <AlgorithmInfo>
            <div style={{ fontSize: '1.5rem' }}>🧠</div>
            <div>
              <AlgorithmName>{loadedAlgorithm}</AlgorithmName>
              <AlgorithmSubtext>알고리즘 템플릿에서 로드된 회로입니다. 바로 실행해보세요!</AlgorithmSubtext>
            </div>
          </AlgorithmInfo>
          <DismissButton onClick={() => setLoadedAlgorithm(null)}>
            ✕ 닫기
          </DismissButton>
        </AlgorithmBanner>
      )}
      
      <GridLayout>
        {/* 게이트 팔레트 */}
        <GatePalette>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            🧩 게이트 팔레트
          </h3>
          {availableGates.map((gate) => (
            <GateButton
              key={gate.type}
              color={gate.color}
              draggable
              onDragStart={(e) => handleDragStart(e, gate.type)}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {gate.symbol}
              </div>
              <div style={{ fontSize: '0.9rem' }}>{gate.name}</div>
            </GateButton>
          ))}
          
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            background: '#f3f4f6', 
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#6b7280'
          }}>
            💡 <strong>CNOT 사용법:</strong><br />
            CNOT 게이트를 드래그하면 제어/타깃 큐비트를 선택할 수 있는 창이 열립니다.
          </div>
        </GatePalette>

        {/* 회로 캔버스 */}
        <CircuitCanvas>
          <ControlButtons>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              ⚡ 양자 회로
            </h3>
            <ClearButton onClick={clearCircuit}>
              🗑️ 초기화
            </ClearButton>
          </ControlButtons>

          <CircuitGrid style={{ position: 'relative' }}>
            {/* CNOT 연결선 */}
            {renderCNOTConnections()}
            
            {Array.from({ length: numQubits }, (_, qubit) => (
              <CircuitRow key={qubit}>
                <QubitLabel>Q{qubit}:</QubitLabel>
                {Array.from({ length: numSteps }, (_, step) => {
                  const gate = getGateAtPosition(qubit, step);
                  const isDragOver = dragOverPosition && 
                    dragOverPosition.qubit === qubit && 
                    dragOverPosition.step === step;
                  
                  return (
                    <GateSlot
                      key={step}
                      dragOver={isDragOver}
                      onDragOver={(e) => handleDragOver(e, qubit, step)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, qubit, step)}
                    >
                      {gate ? (
                        <PlacedGate
                          color={getGateColor(gate.type)}
                          onClick={() => removeGate(gate.id)}
                          title={`${gate.type} 게이트 (클릭하여 제거)`}
                        >
                          {gate.type === 'CNOT' ? 
                            (gate.qubit === qubit ? '●' : '⊕') : // 제어는 ●, 타깃은 ⊕
                            gate.type
                          }
                          {/* CNOT의 경우 연결 정보 표시 */}
                          {gate.type === 'CNOT' && (
                            <div style={{ 
                              position: 'absolute', 
                              bottom: '-18px', 
                              fontSize: '0.6rem', 
                              whiteSpace: 'nowrap',
                              color: '#6b7280'
                            }}>
                              {gate.qubit === qubit ? `→Q${gate.targetQubit}` : `Q${gate.qubit}→`}
                            </div>
                          )}
                        </PlacedGate>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {step + 1}
                        </div>
                      )}
                    </GateSlot>
                  );
                })}
              </CircuitRow>
            ))}
          </CircuitGrid>
        </CircuitCanvas>

        {/* 사이드 패널 */}
        <SidePanel>
          <StepControls
            onRun={handleRun}
            onSlowRun={handleSlowRun}
            onStop={handleStop}
            onPause={handlePause}
            onStepChange={handleStepChange}
            runStatus={runStatus}
            isPaused={isPaused}
            currentStep={currentStep}
            totalSteps={totalSteps}
            speed={stepSpeed}
            onSpeedChange={setStepSpeed}
            circuitGates={circuitGates}
            canRun={canRun}
          />
        </SidePanel>
      </GridLayout>

      {/* 결과 섹션 */}
      <ResultsSection>
        <ResultVisualization
          results={simulationResult}
          stepInfo={currentStepInfo}
          onStepChange={runStatus === 'step' ? handleStepChange : null}
          showAnimation={runStatus === 'step'}
        />
        
        <QuantumInfoPanel
          simulator={simulationResult ? simulator : null}
          circuitGates={circuitGates}
        />
      </ResultsSection>

      {/* CNOT 설정 모달 */}
      <CNOTModal
        isOpen={cnotModalOpen}
        onClose={() => {
          setCnotModalOpen(false);
          setPendingCnotPosition(null);
        }}
        onConfirm={handleCnotConfirm}
        numQubits={numQubits}
        occupiedQubits={pendingCnotPosition ? getOccupiedQubits(pendingCnotPosition.step) : []}
        step={pendingCnotPosition ? pendingCnotPosition.step : 0}
      />



      {/* 토스트 메시지 컨테이너 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </MainContainer>
  );
};

export default CircuitBuilder; 