import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlgorithmTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  const templates = [
    {
      id: 'grover',
      name: 'Grover 알고리즘 (2-큐비트)',
      description: '데이터베이스 검색을 O(√N)으로 가속화',
      icon: '🔍',
      advantage: 'Classical: O(N) → Quantum: O(√N)',
      explanation: '정렬되지 않은 데이터베이스에서 특정 항목을 찾는 알고리즘입니다. 이 예제는 |11⟩ 상태를 찾는 2-큐비트 버전입니다. 실제 구현에서는 오라클 함수가 더 복잡하게 구성됩니다.',
      gates: [
        // 초기화: 균등 중첩 상태 생성
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        // Oracle: |11⟩ 상태에만 음의 위상 적용
        // 실제로는 다중 제어 Z 게이트 또는 보조 큐비트를 사용
        // 교육 목적으로 CZ 게이트로 근사 (|11⟩ → -|11⟩)
        { type: 'CNOT', qubit: 0, step: 1, targetQubit: 1 },
        { type: 'Z', qubit: 1, step: 1 },
        { type: 'CNOT', qubit: 0, step: 1, targetQubit: 1 },
        // Diffusion 연산자 (진폭 증폭)
        { type: 'H', qubit: 0, step: 2 },
        { type: 'H', qubit: 1, step: 2 },
        { type: 'X', qubit: 0, step: 3 },
        { type: 'X', qubit: 1, step: 3 },
        { type: 'CNOT', qubit: 0, step: 4, targetQubit: 1 },
        { type: 'Z', qubit: 1, step: 4 },
        { type: 'CNOT', qubit: 0, step: 4, targetQubit: 1 },
        { type: 'X', qubit: 0, step: 5 },
        { type: 'X', qubit: 1, step: 5 },
        { type: 'H', qubit: 0, step: 6 },
        { type: 'H', qubit: 1, step: 6 }
      ],
      comparison: {
        classical: 'N개 항목 중 하나를 찾으려면 평균적으로 N/2번의 검색이 필요',
        quantum: '√N번의 검색만으로 충분하므로 큰 데이터베이스에서 엄청난 가속 효과'
      },
      scientific_note: '⚠️ 참고: 실제 그로버 오라클은 더 복잡한 다중 제어 게이트로 구현됩니다. 이 템플릿은 교육 목적으로 단순화된 버전입니다.'
    },
    {
      id: 'teleportation',
      name: '양자 텔레포테이션',
      description: '양자 상태를 원거리로 전송',
      icon: '📡',
      advantage: 'Classical: 불가능 → Quantum: 가능',
      explanation: '양자 상태를 물리적으로 이동시키지 않고 다른 위치로 전송하는 프로토콜입니다.',
      gates: [
        { type: 'H', qubit: 1, step: 0 },
        { type: 'CNOT', qubit: 1, step: 1, targetQubit: 2 },
        { type: 'CNOT', qubit: 0, step: 2, targetQubit: 1 },
        { type: 'H', qubit: 0, step: 3 }
      ],
      comparison: {
        classical: '양자 상태의 완벽한 복사는 양자역학 법칙상 불가능',
        quantum: '얽힘과 고전 통신을 이용해 양자 상태를 완벽하게 전송 가능'
      }
    },
    {
      id: 'ghz',
      name: 'GHZ 상태',
      description: '3-큐비트 최대 얽힘 상태 생성',
      icon: '🔗',
      advantage: 'Classical: 독립적 상관관계만 가능 → Quantum: 완전한 얽힘',
      explanation: '3개의 큐비트가 최대로 얽힌 상태를 생성합니다. |000⟩ + |111⟩ 형태의 상태입니다.',
      gates: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'CNOT', qubit: 0, step: 1, targetQubit: 1 },
        { type: 'CNOT', qubit: 1, step: 2, targetQubit: 2 }
      ],
      comparison: {
        classical: '세 개의 동전이 독립적으로 상관관계를 가질 수 있지만 완전한 동기화는 불가능',
        quantum: '세 큐비트가 완전히 얽혀서 하나의 측정이 나머지 모든 큐비트의 상태를 결정'
      }
    },
    {
      id: 'deutsch',
      name: 'Deutsch 알고리즘',
      description: '함수의 상수/균형 성질을 한 번에 판별',
      icon: '🎯',
      advantage: 'Classical: 2번 함수 호출 → Quantum: 1번 함수 호출',
      explanation: '블랙박스 함수가 상수함수인지 균형함수인지를 단 한 번의 함수 호출로 알아내는 최초의 양자 알고리즘입니다.',
      gates: [
        // 보조 큐비트를 |1⟩으로 초기화
        { type: 'X', qubit: 1, step: 0 },
        // 중첩 상태 생성
        { type: 'H', qubit: 0, step: 1 },
        { type: 'H', qubit: 1, step: 1 },
        // Oracle 함수 (여기서는 항등 함수 예시)
        // 실제로는 함수에 따라 다른 게이트 적용
        // 최종 측정을 위한 Hadamard
        { type: 'H', qubit: 0, step: 3 }
      ],
      comparison: {
        classical: '함수 f의 성질을 알려면 f(0)과 f(1)을 모두 계산해야 함',
        quantum: '양자 중첩을 이용해 f(0)과 f(1)을 동시에 계산하여 한 번에 판별 가능'
      }
    },
    {
      id: 'simon',
      name: 'Simon 알고리즘',
      description: '숨겨진 주기성을 지수적으로 빠르게 발견',
      icon: '🔄',
      advantage: 'Classical: O(2^(n/2)) → Quantum: O(n)',
      explanation: '함수의 숨겨진 주기 구조를 찾는 알고리즘으로, Shor 알고리즘의 전신이 되었습니다.',
      gates: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        { type: 'CNOT', qubit: 0, step: 2, targetQubit: 2 },
        { type: 'CNOT', qubit: 1, step: 2, targetQubit: 2 },
        { type: 'H', qubit: 0, step: 3 },
        { type: 'H', qubit: 1, step: 3 }
      ],
      comparison: {
        classical: '2^n개의 입력을 모두 확인해야 숨겨진 패턴을 찾을 수 있음',
        quantum: '양자 간섭을 이용해 O(n)번의 측정만으로 숨겨진 주기를 발견'
      }
    },
    {
      id: 'shor',
      name: 'Shor 알고리즘 (간소화)',
      description: '소인수분해를 다항시간에 해결',
      icon: '🔐',
      advantage: 'Classical: O(exp(n^(1/3))) → Quantum: O(n³)',
      explanation: '큰 수의 소인수분해를 다항시간에 해결하여 RSA 암호를 무력화할 수 있는 혁명적인 알고리즘입니다. 이는 핵심 요소만 보여주는 간소화된 버전입니다.',
      gates: [
        // 양자 푸리에 변환을 위한 중첩 상태 생성
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        // 모듈러 지수 연산 시뮬레이션 (실제로는 매우 복잡)
        { type: 'X', qubit: 2, step: 1 },
        { type: 'CNOT', qubit: 0, step: 2, targetQubit: 2 },
        { type: 'CNOT', qubit: 1, step: 3, targetQubit: 2 },
        // 역 양자 푸리에 변환
        { type: 'H', qubit: 0, step: 4 },
        { type: 'H', qubit: 1, step: 4 }
      ],
      comparison: {
        classical: '2048비트 수의 소인수분해에 수십억 년이 소요됨',
        quantum: '양자 푸리에 변환을 이용해 주기 찾기 문제로 변환하여 몇 시간 내에 해결 가능'
      }
    }
  ];

  const applyTemplate = (template) => {
    // CircuitBuilder 형식에 맞게 게이트 데이터 변환
    const convertedGates = [];
    let gateId = 1;

    template.gates.forEach(gate => {
      if (gate.type === 'CNOT') {
        // CNOT 게이트는 제어와 타겟 두 개의 게이트 객체로 분리
        const controlGate = {
          id: gateId++,
          type: 'CNOT',
          qubit: gate.qubit,
          step: gate.step,
          targetQubit: gate.targetQubit,
          role: 'control'
        };

        const targetGate = {
          id: gateId++,
          type: 'CNOT',
          qubit: gate.targetQubit,
          step: gate.step,
          targetQubit: gate.qubit, // 역참조
          role: 'target'
        };

        convertedGates.push(controlGate, targetGate);
      } else {
        // 일반 게이트는 그대로 변환
        convertedGates.push({
          id: gateId++,
          type: gate.type,
          qubit: gate.qubit,
          step: gate.step
        });
      }
    });

    // React Router를 사용하여 circuit-builder 페이지로 이동하면서 변환된 데이터 전달
    const gatesData = encodeURIComponent(JSON.stringify(convertedGates));
    navigate(`/circuit-builder?template=${template.id}&gates=${gatesData}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            양자 알고리즘 템플릿
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            유명한 양자 알고리즘들을 한 번에 체험하고 고전 컴퓨터와 비교해보세요
          </p>
          <div className="flex justify-center">
            <a
              href="/simulation"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span className="text-xl">⚡</span>
              <span>실시간 성능 비교 시뮬레이션</span>
            </a>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="text-4xl mb-4 text-center">{template.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4 text-center text-sm">
                  {template.description}
                </p>
                
                <div className="bg-gradient-to-r from-blue-200 to-emerald-450 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2"> 성능 비교</h4>
                  <p className="text-blue-700 text-sm font-medium">{template.advantage}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    📖 자세히 보기
                  </button>
                  <button
                    onClick={() => applyTemplate(template)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    🚀 적용하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTemplate.icon} {selectedTemplate.name}
                  </h2>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Algorithm Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">📋 알고리즘 설명</h3>
                    <p className="text-gray-600 mb-6">{selectedTemplate.explanation}</p>

                    <h3 className="text-lg font-semibold mb-4">⚡ 성능 우위</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                      <p className="text-purple-700 font-medium mb-2">{selectedTemplate.advantage}</p>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">🔍 비교 분석</h3>
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-800 mb-2">🖥️ 고전 컴퓨터</h4>
                        <p className="text-red-700 text-sm">{selectedTemplate.comparison.classical}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">⚛️ 양자 컴퓨터</h4>
                        <p className="text-green-700 text-sm">{selectedTemplate.comparison.quantum}</p>
                      </div>
                    </div>
                  </div>

                  {/* Circuit Visualization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">🔧 회로 구성</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-center text-gray-600 mb-4">
                        {selectedTemplate.gates.length}개 게이트로 구성된 회로
                      </div>
                      
                      {/* Enhanced circuit visualization */}
                      <div className="space-y-4 relative">
                        {[0, 1, 2].map(qubit => (
                          <div key={qubit} className="flex items-center relative">
                            <div className="w-12 text-sm font-medium">Q{qubit}:</div>
                            <div className="flex-1 border-t-2 border-gray-400 relative h-8">
                              {/* 일반 게이트들 */}
                              {selectedTemplate.gates
                                .filter(gate => gate.qubit === qubit)
                                .map((gate, index) => {
                                  if (gate.type === 'CNOT') {
                                    // CNOT의 제어 큐비트인지 타겟 큐비트인지 확인
                                    const isControl = gate.qubit === qubit;
                                    return (
                                      <div
                                        key={index}
                                        className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-orange-500"
                                        style={{ left: `${gate.step * 60 + 10}px`, top: '-16px' }}
                                      >
                                        {isControl ? '●' : '⊕'}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div
                                        key={index}
                                        className={`absolute w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold
                                          ${gate.type === 'H' ? 'bg-purple-500' :
                                            gate.type === 'X' ? 'bg-red-500' :
                                            gate.type === 'Y' ? 'bg-green-500' :
                                            gate.type === 'Z' ? 'bg-blue-500' :
                                            'bg-gray-500'}`}
                                        style={{ left: `${gate.step * 60 + 10}px`, top: '-16px' }}
                                      >
                                        {gate.type}
                                      </div>
                                    );
                                  }
                                })}
                              
                              {/* CNOT 연결선 그리기 */}
                              {selectedTemplate.gates
                                .filter(gate => gate.type === 'CNOT')
                                .map((cnotGate, index) => {
                                  if (cnotGate.qubit === qubit || cnotGate.targetQubit === qubit) {
                                    const controlQubit = cnotGate.qubit;
                                    const targetQubit = cnotGate.targetQubit;
                                    const minQubit = Math.min(controlQubit, targetQubit);
                                    const maxQubit = Math.max(controlQubit, targetQubit);
                                    
                                    if (qubit === minQubit) {
                                      const lineHeight = (maxQubit - minQubit) * 32;
                                      return (
                                        <div
                                          key={`line-${index}`}
                                          className="absolute bg-orange-400"
                                          style={{
                                            left: `${cnotGate.step * 60 + 10 + 16}px`,
                                            top: '0px',
                                            width: '2px',
                                            height: `${lineHeight + 16}px`,
                                            zIndex: 1
                                          }}
                                        />
                                      );
                                    }
                                  }
                                  return null;
                                })}
                              
                              {/* 타겟 큐비트에도 CNOT 표시 */}
                              {selectedTemplate.gates
                                .filter(gate => gate.type === 'CNOT' && gate.targetQubit === qubit)
                                .map((gate, index) => (
                                  <div
                                    key={`target-${index}`}
                                    className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-orange-500"
                                    style={{ left: `${gate.step * 60 + 10}px`, top: '-16px', zIndex: 2 }}
                                  >
                                    ⊕
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => applyTemplate(selectedTemplate)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                    >
                      🚀 회로 빌더에서 실행하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎓 학습 경로 추천
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">기초 학습</h3>
              <p className="text-sm text-gray-600">
                양자컴퓨터 설명 페이지에서 기본 개념 익히기
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">실습</h3>
              <p className="text-sm text-gray-600">
                템플릿을 사용해서 유명한 알고리즘들 체험하기
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">창작</h3>
              <p className="text-sm text-gray-600">
                직접 회로를 설계하고 블로흐 스튜디오에서 탐구하기
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmTemplates; 