import React, { useState, useEffect } from 'react';

const AlgorithmSimulation = () => {
  const [activeSimulation, setActiveSimulation] = useState('grover');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState({});
  const [databaseSize, setDatabaseSize] = useState(16);
  const [rsaKeySize, setRsaKeySize] = useState(64);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [targetItem, setTargetItem] = useState(11); // 찾는 항목 (인덱스 11)
  const [foundClassical, setFoundClassical] = useState(false);
  const [foundQuantum, setFoundQuantum] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState('');

  // 데이터베이스 아이템들을 시각적으로 표현
  const generateDatabaseItems = () => {
    return Array.from({ length: databaseSize }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 100) + 1,
      isTarget: i === targetItem,
      isSearched: false,
      isFound: false
    }));
  };

  const [databaseItems, setDatabaseItems] = useState(generateDatabaseItems());

  // 데이터베이스 크기가 변경될 때 아이템 재생성
  useEffect(() => {
    const newTarget = Math.floor(Math.random() * databaseSize);
    setTargetItem(newTarget);
    setDatabaseItems(generateDatabaseItems());
    resetSimulation();
  }, [databaseSize]);

  // 그로버 알고리즘 시뮬레이션 (시각적 단계별 설명)
  const runGroverSimulation = async () => {
    setIsRunning(true);
    setFoundClassical(false);
    setFoundQuantum(false);
    setSearchHistory([]);
    
    // 데이터베이스 아이템 초기화
    const items = Array.from({ length: databaseSize }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 100) + 1,
      isTarget: i === targetItem,
      isSearched: false,
      isFound: false
    }));
    setDatabaseItems(items);

    setCurrentExplanation('🎯 미션: 특별한 보물 상자를 찾아라! (상자 ' + targetItem + '번)');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 클래식 탐색 시뮬레이션
    setCurrentExplanation('📖 고전 방법: 하나씩 차근차근 열어보기');
    await new Promise(resolve => setTimeout(resolve, 1500));

    let classicalSteps = 0;
    for (let i = 0; i < databaseSize; i++) {
      setCurrentSearchIndex(i);
      classicalSteps++;
      
      const newItems = [...items];
      newItems[i] = { ...newItems[i], isSearched: true };
      setDatabaseItems(newItems);
      
      setSearchHistory(prev => [...prev, { type: 'classical', step: classicalSteps, index: i }]);
      setCurrentExplanation(`🔍 ${classicalSteps}번째 시도: ${i}번 상자를 열어봤어요...`);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (i === targetItem) {
        newItems[i] = { ...newItems[i], isFound: true };
        setDatabaseItems(newItems);
        setFoundClassical(true);
        setCurrentExplanation(`🎉 찾았다! ${classicalSteps}번 만에 보물을 발견했어요!`);
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 데이터베이스 리셋
    const resetItems = Array.from({ length: databaseSize }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 100) + 1,
      isTarget: i === targetItem,
      isSearched: false,
      isFound: false
    }));
    setDatabaseItems(resetItems);
    setCurrentSearchIndex(-1);

    // 그로버 알고리즘 설명
    setCurrentExplanation('⚡ 양자 방법: 마법처럼 한 번에 여러 상자를 확인!');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 그로버 알고리즘의 실제 과학적 원리
    const quantumSteps = Math.ceil(Math.sqrt(databaseSize));
    
    // 1단계: 중첩 상태 생성
    setCurrentExplanation('1️⃣ 모든 상자를 동시에 열어볼 준비를 해요 (양자 중첩상태)');
    const superpositionItems = resetItems.map(item => ({ ...item, isSearched: true, opacity: 0.5 }));
    setDatabaseItems(superpositionItems);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2단계: 그로버 반복 (오라클 + 디퓨전)
    for (let step = 1; step <= quantumSteps; step++) {
      setCurrentExplanation(`${step + 1}️⃣ 그로버 반복 ${step}번째: 오라클로 표시하고, 디퓨전으로 증폭!`);
      
      // 시각적 효과: 타겟 아이템을 점점 밝게 (진폭 증폭 시뮬레이션)
      const amplifyItems = superpositionItems.map(item => ({
        ...item,
        opacity: item.isTarget ? Math.min(1, 0.3 + (step * 0.3)) : Math.max(0.2, 0.5 - (step * 0.1))
      }));
      setDatabaseItems(amplifyItems);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 3단계: 측정
    setCurrentExplanation('3️⃣ 양자 측정으로 답을 확인해요! (확률적 붕괴)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalItems = resetItems.map(item => ({
      ...item,
      isFound: item.isTarget,
      isSearched: item.isTarget
    }));
    setDatabaseItems(finalItems);
    setFoundQuantum(true);
    
    setCurrentExplanation(`🎯 성공! 그로버 알고리즘은 약 ${quantumSteps}번만에 답을 찾았어요!`);

    // 결과 계산
    const results = {
      classicalSteps,
      quantumSteps,
      speedup: classicalSteps / quantumSteps,
      classicalTime: classicalSteps * 0.3,
      quantumTime: quantumSteps * 1.5,
      databaseSize
    };

    setSimulationResults(results);
    setIsRunning(false);
  };

  // RSA vs 쇼어 알고리즘 시뮬레이션 (수학 문제로 단순화)
  const runShorSimulation = async () => {
    setIsRunning(true);
    
    const secretNumber = 15; // 3 × 5
    setCurrentExplanation(`🔢 미션: 숫자 ${secretNumber}을 두 개의 소수로 나누어보세요!`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 고전 방법: 하나씩 나눠보기
    setCurrentExplanation('🖥️ 고전 방법: 2부터 시작해서 하나씩 나눠보기');
    await new Promise(resolve => setTimeout(resolve, 1500));

    let classicalAttempts = 0;
    for (let i = 2; i <= Math.sqrt(secretNumber); i++) {
      classicalAttempts++;
      setCurrentExplanation(`${classicalAttempts}번째 시도: ${secretNumber} ÷ ${i} = ?`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (secretNumber % i === 0) {
        const factor2 = secretNumber / i;
        setCurrentExplanation(`🎉 찾았다! ${secretNumber} = ${i} × ${factor2}`);
        break;
      } else {
        setCurrentExplanation(`❌ ${i}로는 나누어떨어지지 않아요...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    // 양자 방법 설명
    setCurrentExplanation('⚛️ 양자 방법: 쇼어 알고리즘의 양자 푸리에 변환!');
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentExplanation('1️⃣ 모든 가능한 지수를 양자 중첩으로 준비해요');
    await new Promise(resolve => setTimeout(resolve, 2000));

    setCurrentExplanation('2️⃣ 모듈러 지수함수의 주기성을 양자적으로 계산해요');
    await new Promise(resolve => setTimeout(resolve, 2000));

    setCurrentExplanation('3️⃣ 양자 푸리에 변환(QFT)으로 숨겨진 주기를 찾아요!');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentExplanation('4️⃣ 주기에서 유클리드 호제법으로 소인수를 계산해요!');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentExplanation('🎯 결과: 15 = 3 × 5 (양자 알고리즘으로 지수적 가속!)');

    const results = {
      classicalAttempts,
      quantumAttempts: 1,
      secretNumber,
      factors: [3, 5],
      speedup: classicalAttempts / 1,
      quantumNote: '실제로는 양자 푸리에 변환과 모듈러 지수연산이 핵심입니다.'
    };

    setSimulationResults(results);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setSimulationResults({});
    setIsRunning(false);
    setCurrentSearchIndex(-1);
    setFoundClassical(false);
    setFoundQuantum(false);
    setSearchHistory([]);
    setCurrentExplanation('');
    setDatabaseItems(generateDatabaseItems());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            알고리즘 대결 시뮬레이션
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            양자 알고리즘 vs 고전 알고리즘! 누가 더 빠를까요? 직접 확인해보세요! 🏁
          </p>
        </div>

        {/* Current Explanation Box */}
        {currentExplanation && (
          <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-2xl font-bold">
              {currentExplanation}
            </h3>
          </div>
        )}

        {/* Simulation Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-white/20">
            <div className="flex gap-2">
              <button
                onClick={() => {setActiveSimulation('grover'); resetSimulation();}}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  activeSimulation === 'grover'
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <span className="text-xl">🎯</span>
                <span>보물찾기 대결</span>
              </button>
              <button
                onClick={() => {setActiveSimulation('shor'); resetSimulation();}}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  activeSimulation === 'shor'
                    ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <span className="text-xl">🔢</span>
                <span>수학 문제 대결</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grover Algorithm Simulation */}
        {activeSimulation === 'grover' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🎯 보물찾기 대결: 그로버 vs 하나씩 찾기
              </h2>
              <p className="text-gray-600 text-lg">
                숨겨진 보물 상자를 찾는 두 가지 방법을 비교해보세요!
              </p>
            </div>

            {/* Game Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🎮</span>
                  게임 설정
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">
                      상자 개수: {databaseSize}개
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="64"
                      step="4"
                      value={databaseSize}
                      onChange={(e) => setDatabaseSize(parseInt(e.target.value))}
                      className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      disabled={isRunning}
                    />
                  </div>
                  <div className="text-sm text-blue-600 bg-blue-100 p-3 rounded-lg">
                    <p><strong>고전 방법:</strong> 평균 {Math.floor(databaseSize/2)}번 확인</p>
                    <p><strong>그로버 방법:</strong> 약 {Math.ceil(Math.sqrt(databaseSize))}번 확인</p>
                    <p><strong>예상 가속:</strong> {(databaseSize/2/Math.ceil(Math.sqrt(databaseSize))).toFixed(1)}배 빨라요!</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">🏆</span>
                  결과 현황
                </h3>
                {simulationResults.classicalSteps && simulationResults.quantumSteps ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">고전 방법:</span>
                      <span className="font-bold text-green-800">{simulationResults.classicalSteps}번</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">그로버 방법:</span>
                      <span className="font-bold text-green-800">{simulationResults.quantumSteps}번</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-green-700">승부 결과:</span>
                      <span className="font-bold text-green-800 text-lg">
                        그로버가 {simulationResults.speedup.toFixed(1)}배 승리! 🎉
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-green-600">
                    <p className="text-4xl mb-2">🎯</p>
                    <p>게임을 시작해보세요!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Database */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                📦 보물 상자들 (목표: {targetItem}번 상자의 보물!)
              </h3>
              <div className="grid grid-cols-8 gap-2 max-w-4xl mx-auto">
                {databaseItems.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      relative w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm
                      transition-all duration-500 transform
                      ${item.isFound 
                        ? 'bg-yellow-400 border-yellow-500 shadow-lg scale-110 animate-pulse' 
                        : item.isSearched 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-100 border-gray-300'}
                      ${currentSearchIndex === index ? 'ring-4 ring-red-400 scale-110' : ''}
                    `}
                    style={{ opacity: item.opacity || 1 }}
                  >
                    {item.isFound ? '💎' : item.isSearched ? '📭' : '📦'}
                    <span className="absolute -bottom-6 text-xs text-gray-600">{index}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Indicators */}
            {searchHistory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                  <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                    <span className="mr-2">🖥️</span>
                    고전 방법 진행상황
                  </h4>
                  <div className="space-y-2">
                    {searchHistory
                      .filter(h => h.type === 'classical')
                      .slice(-5)
                      .map((history, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span>시도 {history.step}:</span>
                          <span className={history.index === targetItem ? 'text-green-600 font-bold' : ''}>
                            {history.index}번 상자 {history.index === targetItem ? '✅' : '❌'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <span className="mr-2">⚛️</span>
                    그로버 방법 상태
                  </h4>
                  <div className="text-center">
                    {foundQuantum ? (
                      <div className="text-blue-800">
                        <div className="text-4xl mb-2">🎉</div>
                        <p className="font-bold">성공!</p>
                        <p className="text-sm">양자 중첩과 간섭으로 한 번에 찾았어요!</p>
                      </div>
                    ) : (
                      <div className="text-blue-600">
                        <div className="text-4xl mb-2">⚛️</div>
                        <p>양자 상태로 탐색 중...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Control Button */}
            <div className="text-center">
              <button
                onClick={runGroverSimulation}
                disabled={isRunning}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isRunning 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:scale-105 shadow-lg'
                }`}
              >
                {isRunning ? '게임 진행 중... 🎮' : '🚀 보물찾기 대결 시작!'}
              </button>
            </div>
          </div>
        )}

        {/* Shor Algorithm Simulation */}
        {activeSimulation === 'shor' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🔢 수학 문제 대결: 쇼어 vs 하나씩 나누기
              </h2>
              <p className="text-gray-600 text-lg">
                숫자를 소수로 나누는 두 가지 방법을 비교해보세요!
              </p>
            </div>

            {/* Math Problem Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <span className="mr-2">🧮</span>
                  수학 문제
                </h3>
                <div className="text-center">
                  <div className="text-6xl font-bold text-red-600 mb-4">15</div>
                  <p className="text-red-700 text-lg mb-4">이 숫자를 두 개의 소수로 나누어보세요!</p>
                  <div className="bg-red-100 p-4 rounded-lg text-sm text-red-600">
                    <p><strong>힌트:</strong> 소수는 1과 자기 자신으로만 나누어떨어지는 수예요</p>
                    <p>예: 2, 3, 5, 7, 11, 13...</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="mr-2">🏆</span>
                  결과 비교
                </h3>
                {simulationResults.classicalAttempts && simulationResults.quantumAttempts ? (
                  <div className="space-y-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <p className="font-semibold text-red-800">고전 방법</p>
                      <p className="text-red-600">{simulationResults.classicalAttempts}번 시도</p>
                      <p className="text-sm text-red-500">하나씩 나누어보기</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="font-semibold text-blue-800">쇼어 알고리즘</p>
                      <p className="text-blue-600">{simulationResults.quantumAttempts}번 시도</p>
                      <p className="text-sm text-blue-500">양자 마법 사용!</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg text-center">
                      <p className="font-bold text-green-800 text-lg">
                        답: {simulationResults.secretNumber} = {simulationResults.factors[0]} × {simulationResults.factors[1]}
                      </p>
                      <p className="text-green-600">쇼어가 {simulationResults.speedup}배 빨라요! 🎉</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-purple-600">
                    <p className="text-4xl mb-2">🔢</p>
                    <p>수학 대결을 시작해보세요!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step by Step Explanation */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                📚 단계별 설명
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center">
                    <span className="mr-2">🖥️</span>
                    고전 방법
                  </h4>
                  <div className="space-y-2 text-sm text-red-700">
                    <p>1. 2로 나누어보기: 15 ÷ 2 = 7.5 ❌</p>
                    <p>2. 3으로 나누어보기: 15 ÷ 3 = 5 ✅</p>
                    <p>3. 답 발견: 15 = 3 × 5</p>
                    <p className="text-red-500 font-medium">총 2번의 시도 필요</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">⚛️</span>
                    쇼어 알고리즘
                  </h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>1. 모든 수를 동시에 고려 (중첩상태)</p>
                    <p>2. 특별한 패턴(주기) 찾기</p>
                    <p>3. 양자 푸리에 변환으로 답 도출</p>
                    <p className="text-blue-500 font-medium">총 1번의 시도로 완료!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">왜 이게 중요할까요?</h4>
                  <p className="text-yellow-700 mb-2">
                    인터넷 쇼핑이나 온라인 뱅킹에서 사용하는 보안(RSA 암호)이 바로 이런 수학 문제에 기반해요!
                  </p>
                  <p className="text-yellow-600 text-sm">
                    현재는 매우 큰 숫자(2048자리!)를 사용해서 안전하지만, 
                    쇼어 알고리즘이 완성되면 새로운 보안 방법이 필요해질 거예요.
                  </p>
                </div>
              </div>
            </div>

            {/* Control Button */}
            <div className="text-center">
              <button
                onClick={runShorSimulation}
                disabled={isRunning}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isRunning 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-purple-500 text-white hover:from-red-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                }`}
              >
                {isRunning ? '수학 대결 진행 중... 🧮' : '🔢 수학 문제 대결 시작!'}
              </button>
            </div>
          </div>
        )}

        {/* Educational Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🎓 배운 내용 정리
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                그로버 알고리즘
              </h3>
              <div className="space-y-3 text-green-700">
                <p><strong>🔍 무엇을 하나요?</strong> 정렬되지 않은 데이터에서 원하는 것을 빠르게 찾아요</p>
                <p><strong>⚡ 얼마나 빨라요?</strong> 일반 방법보다 √N배 빨라요</p>
                <p><strong>🌟 비밀은?</strong> 양자 중첩으로 여러 가지를 동시에 확인해요</p>
                <p><strong>🏃‍♂️ 예시:</strong> 1만 개 중에서 찾기 → 100번이면 충분!</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <span className="mr-2">🔐</span>
                쇼어 알고리즘
              </h3>
              <div className="space-y-3 text-red-700">
                <p><strong>🔢 무엇을 하나요?</strong> 큰 숫자를 소수들의 곱으로 나누어요</p>
                <p><strong>⚡ 얼마나 빨라요?</strong> 지수적으로 빨라져서 거의 마법 수준!</p>
                <p><strong>🌟 비밀은?</strong> 양자 푸리에 변환으로 숨겨진 패턴을 찾아요</p>
                <p><strong>💻 영향:</strong> 현재 인터넷 보안 시스템을 바꿀 수도 있어요</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-purple-800 mb-3">🚀 결론</h4>
            <p className="text-purple-700 text-lg">
              양자 컴퓨터는 특별한 문제들을 매우 빠르게 해결할 수 있어요! 
              미래에는 새로운 약 개발, 날씨 예측, 인공지능 등 많은 분야에서 도움이 될 거예요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSimulation; 