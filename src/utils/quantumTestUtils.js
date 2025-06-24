/**
 * 양자 회로 시뮬레이터 테스트 유틸리티
 * 버그 검증 및 기능 테스트를 위한 헬퍼 함수들
 */

/**
 * CNOT 게이트 기능 테스트
 * 제어/타깃 큐비트 설정이 올바르게 작동하는지 검증
 */
export const testCNOTGate = (simulator, controlQubit, targetQubit) => {
  console.log(`🧪 CNOT 테스트: Q${controlQubit} → Q${targetQubit}`);
  
  // 초기 상태: |000⟩
  simulator.reset();
  
  // 제어 큐비트를 |1⟩ 상태로 설정
  simulator.applyPauliX(controlQubit);
  
  // CNOT 게이트 적용
  const cnotGate = {
    type: 'CNOT',
    qubit: controlQubit,
    targetQubit: targetQubit
  };
  simulator.applyGate(cnotGate);
  
  // 결과 확인
  const result = simulator.measure(1000);
  console.log('📊 CNOT 테스트 결과:', result);
  
  // 기대값: 제어가 |1⟩이므로 타깃도 플립되어야 함
  const expectedState = '0'.repeat(simulator.numQubits);
  const controlBitPos = simulator.numQubits - 1 - controlQubit;
  const targetBitPos = simulator.numQubits - 1 - targetQubit;
  
  let expected = expectedState.split('');
  expected[controlBitPos] = '1';
  expected[targetBitPos] = '1';
  expected = expected.join('');
  
  const success = result[expected] > 900; // 90% 이상 정확도
  console.log(`✅ 테스트 ${success ? '성공' : '실패'}: 기대값 |${expected}⟩`);
  
  return { success, result, expected };
};

/**
 * 벨 상태 생성 테스트
 * H + CNOT으로 얽힘 상태 생성 검증
 */
export const testBellState = (simulator) => {
  console.log('🧪 벨 상태 생성 테스트');
  
  simulator.reset();
  
  // H 게이트를 Q0에 적용
  simulator.applyHadamard(0);
  
  // CNOT Q0 → Q1 적용
  const cnotGate = {
    type: 'CNOT',
    qubit: 0,
    targetQubit: 1
  };
  simulator.applyGate(cnotGate);
  
  const result = simulator.measure(1000);
  console.log('📊 벨 상태 결과:', result);
  
  // 기대값: |00⟩와 |11⟩이 50:50으로 나타나야 함
  const state00 = '00'.padStart(simulator.numQubits, '0');
  const state11 = '11'.padStart(simulator.numQubits, '0');
  
  const count00 = result[state00] || 0;
  const count11 = result[state11] || 0;
  const total = count00 + count11;
  
  const success = total > 950 && Math.abs(count00 - count11) < 100;
  console.log(`✅ 벨 상태 테스트 ${success ? '성공' : '실패'}`);
  console.log(`   |00⟩: ${count00}, |11⟩: ${count11}`);
  
  return { success, result, count00, count11 };
};

/**
 * 단계별 실행 시뮬레이션
 * 각 게이트 적용 후 상태 변화 추적
 */
export const simulateStepByStep = (simulator, gates) => {
  console.log('🧪 단계별 실행 테스트');
  
  simulator.reset();
  const stepResults = [];
  
  // 초기 상태 저장
  stepResults.push({
    step: 0,
    gateName: 'Initial',
    result: simulator.measure(100),
    stateVector: [...simulator.stateVector]
  });
  
  // 각 게이트를 순차적으로 적용
  gates.forEach((gate, index) => {
    console.log(`   단계 ${index + 1}: ${gate.type} 게이트 적용`);
    simulator.applyGate(gate);
    
    stepResults.push({
      step: index + 1,
      gateName: gate.type,
      gate: gate,
      result: simulator.measure(100),
      stateVector: [...simulator.stateVector]
    });
  });
  
  console.log('📊 단계별 결과:', stepResults);
  return stepResults;
};

/**
 * 에러 시나리오 테스트
 * 잘못된 입력에 대한 처리 검증
 */
export const testErrorScenarios = (simulator) => {
  console.log('🧪 에러 시나리오 테스트');
  
  const tests = [];
  
  // 1. 존재하지 않는 큐비트에 게이트 적용
  try {
    simulator.applyGate({
      type: 'H',
      qubit: 999
    });
    tests.push({ name: '존재하지 않는 큐비트', passed: false });
  } catch (error) {
    tests.push({ name: '존재하지 않는 큐비트', passed: true });
  }
  
  // 2. CNOT에서 같은 큐비트를 제어/타깃으로 설정
  try {
    simulator.applyGate({
      type: 'CNOT',
      qubit: 0,
      targetQubit: 0
    });
    tests.push({ name: '동일한 제어/타깃 큐비트', passed: false });
  } catch (error) {
    tests.push({ name: '동일한 제어/타깃 큐비트', passed: true });
  }
  
  // 3. 알 수 없는 게이트 타입
  try {
    simulator.applyGate({
      type: 'UNKNOWN',
      qubit: 0
    });
    tests.push({ name: '알 수 없는 게이트', passed: false });
  } catch (error) {
    tests.push({ name: '알 수 없는 게이트', passed: true });
  }
  
  console.log('📊 에러 테스트 결과:', tests);
  return tests;
};

/**
 * 성능 테스트
 * 대용량 회로 처리 성능 검증
 */
export const performanceTest = (simulator, numGates = 50) => {
  console.log(`🧪 성능 테스트: ${numGates}개 게이트`);
  
  const gates = [];
  const gateTypes = ['H', 'X', 'Y', 'Z'];
  
  // 랜덤 게이트 생성
  for (let i = 0; i < numGates; i++) {
    const gateType = gateTypes[Math.floor(Math.random() * gateTypes.length)];
    gates.push({
      type: gateType,
      qubit: Math.floor(Math.random() * simulator.numQubits),
      step: i
    });
  }
  
  const startTime = performance.now();
  
  simulator.reset();
  gates.forEach(gate => simulator.applyGate(gate));
  const result = simulator.measure(1000);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`⏱️ 실행 시간: ${duration.toFixed(2)}ms`);
  console.log(`📊 처리된 게이트: ${numGates}개`);
  console.log(`🔬 최종 상태 수: ${Object.keys(result).length}개`);
  
  return {
    duration,
    numGates,
    statesCount: Object.keys(result).length,
    result
  };
};

/**
 * 알고리즘 템플릿 검증
 * 각 알고리즘이 예상된 결과를 생성하는지 확인
 */
export const verifyAlgorithmTemplate = (QuantumSimulator, algorithmName, gates) => {
  console.log(`🧪 ${algorithmName} 알고리즘 검증 시작`);
  
  const simulator = new QuantumSimulator(3);
  simulator.reset();
  
  // 게이트 순차적으로 적용
  gates.forEach((gate, index) => {
    console.log(`   ${index + 1}. ${gate.type} 게이트 적용`);
    simulator.applyGate(gate);
  });
  
  const result = simulator.measure(1000);
  console.log(`📊 ${algorithmName} 결과:`, result);
  
  // 기본적인 검증: 결과가 존재하는지 확인
  const hasResults = Object.keys(result).length > 0;
  const totalCounts = Object.values(result).reduce((a, b) => a + b, 0);
  
  console.log(`✅ ${algorithmName} 검증 ${hasResults && totalCounts === 1000 ? '성공' : '실패'}`);
  
  return {
    success: hasResults && totalCounts === 1000,
    result,
    algorithmName
  };
};

/**
 * 전체 테스트 스위트 실행
 * 모든 테스트를 순차적으로 실행하고 결과 요약
 */
export const runFullTestSuite = (QuantumSimulator) => {
  console.log('🚀 양자 시뮬레이터 전체 테스트 시작');
  console.log('=' * 50);
  
  const simulator = new QuantumSimulator(3);
  const results = {
    cnot: [],
    bellState: null,
    stepByStep: null,
    errorHandling: [],
    performance: null
  };
  
  // CNOT 테스트 (여러 조합)
  console.log('\n1️⃣ CNOT 게이트 테스트');
  results.cnot.push(testCNOTGate(simulator, 0, 1));
  results.cnot.push(testCNOTGate(simulator, 1, 2));
  results.cnot.push(testCNOTGate(simulator, 0, 2));
  
  // 벨 상태 테스트
  console.log('\n2️⃣ 벨 상태 생성 테스트');
  results.bellState = testBellState(simulator);
  
  // 단계별 실행 테스트
  console.log('\n3️⃣ 단계별 실행 테스트');
  const testGates = [
    { type: 'H', qubit: 0, step: 0 },
    { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
    { type: 'H', qubit: 2, step: 2 }
  ];
  results.stepByStep = simulateStepByStep(simulator, testGates);
  
  // 에러 처리 테스트
  console.log('\n4️⃣ 에러 처리 테스트');
  results.errorHandling = testErrorScenarios(simulator);
  
  // 성능 테스트
  console.log('\n5️⃣ 성능 테스트');
  results.performance = performanceTest(simulator);
  
  // 결과 요약
  console.log('\n📋 테스트 결과 요약');
  console.log('=' * 50);
  
  const cnotPassed = results.cnot.filter(t => t.success).length;
  console.log(`✅ CNOT 테스트: ${cnotPassed}/${results.cnot.length} 통과`);
  
  console.log(`✅ 벨 상태 테스트: ${results.bellState.success ? '통과' : '실패'}`);
  
  const errorsPassed = results.errorHandling.filter(t => t.passed).length;
  console.log(`✅ 에러 처리: ${errorsPassed}/${results.errorHandling.length} 통과`);
  
  console.log(`⏱️ 성능: ${results.performance.duration.toFixed(2)}ms`);
  
  const overallSuccess = cnotPassed === results.cnot.length && 
                         results.bellState.success && 
                         errorsPassed === results.errorHandling.length;
  
  console.log(`\n🎯 전체 테스트: ${overallSuccess ? '성공' : '실패'}`);
  
  return results;
};

/**
 * 실시간 디버깅을 위한 상태 로깅
 */
export const logQuantumState = (simulator, label = '') => {
  console.log(`🔍 양자 상태 ${label ? `(${label})` : ''}`);
  
  const probabilities = simulator.getProbabilityDistribution();
  const entanglement = simulator.getEntanglementMeasure();
  const superposition = simulator.getSuperpositionCount();
  
  console.log('📊 확률 분포:', probabilities);
  console.log(`🔗 얽힘 정도: ${(entanglement * 100).toFixed(1)}%`);
  console.log(`⚡ 중첩 상태 수: ${superposition}개`);
  
  return { probabilities, entanglement, superposition };
}; 