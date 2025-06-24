import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const AlgorithmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
`;

const AlgorithmCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || '#3b82f6'};
  }
`;

const AlgorithmHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const AlgorithmIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
`;

const AlgorithmName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const AlgorithmDescription = styled.div`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CircuitPreview = styled.div`
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
`;

const ComplexityBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.level) {
      case 'easy': return '#dcfce7';
      case 'medium': return '#fef3c7';
      case 'hard': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'easy': return '#15803d';
      case 'medium': return '#d97706';
      case 'hard': return '#dc2626';
      default: return '#374151';
    }
  }};
  margin-bottom: 12px;
`;

const ApplyButton = styled.button`
  width: 100%;
  background: ${props => props.color || '#3b82f6'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.hoverColor || '#2563eb'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const InfoSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

/**
 * 양자 알고리즘 템플릿 페이지
 * 유명한 양자 알고리즘들의 설명과 회로 적용 기능 제공
 */
const AlgorithmTemplates = () => {
  const navigate = useNavigate();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  // 양자 알고리즘 데이터
  const algorithms = [
    {
      id: 'ghz',
      name: 'GHZ 상태',
      icon: '🔗',
      color: '#10b981',
      hoverColor: '#059669',
      complexity: 'easy',
      description: `
        GHZ(Greenberger-Horne-Zeilinger) 상태는 3개 이상의 큐비트가 최대한 얽힌 상태입니다.
        이 상태는 모든 큐비트가 |000⟩ 또는 |111⟩ 상태로만 측정되는 특별한 양자 중첩입니다.
        양자 얽힘의 비국소성과 벨 부등식 위반을 증명하는 데 사용됩니다.
      `,
      circuit: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
        { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 }
      ],
      preview: "Q0: |0⟩──H──●────────\nQ1: |0⟩─────⊕──●───\nQ2: |0⟩────────⊕───",
      applications: "양자 통신, 양자 암호학, 벨 테스트"
    },
    {
      id: 'grover',
      name: '그로버 알고리즘 (간소화)',
      icon: '🔍',
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
      complexity: 'medium',
      description: `
        그로버 알고리즘은 정렬되지 않은 데이터베이스에서 특정 항목을 찾는 양자 알고리즘입니다.
        고전 컴퓨터가 O(N) 시간이 걸리는 작업을 O(√N) 시간에 해결할 수 있습니다.
        이 간소화 버전은 2큐비트로 4개 항목 중 하나를 찾는 예제입니다.
      `,
      circuit: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        { type: 'Z', qubit: 0, step: 1 },
        { type: 'Z', qubit: 1, step: 1 },
        { type: 'H', qubit: 0, step: 2 },
        { type: 'H', qubit: 1, step: 2 },
        { type: 'X', qubit: 0, step: 3 },
        { type: 'X', qubit: 1, step: 3 },
        { type: 'CNOT', qubit: 0, targetQubit: 1, step: 4 },
        { type: 'X', qubit: 0, step: 5 },
        { type: 'X', qubit: 1, step: 5 },
        { type: 'H', qubit: 0, step: 6 },
        { type: 'H', qubit: 1, step: 6 }
      ],
      preview: "Q0: |0⟩──H──Z──H──X──●──X──H──\nQ1: |0⟩──H──Z──H──X──⊕──X──H──",
      applications: "데이터베이스 검색, 최적화 문제"
    },
    {
      id: 'shor',
      name: '쇼어 알고리즘 (간소화)',
      icon: '🔢',
      color: '#f59e0b',
      hoverColor: '#d97706',
      complexity: 'hard',
      description: `
        쇼어 알고리즘은 큰 수를 소인수분해하는 양자 알고리즘입니다.
        RSA 암호화의 기반이 되는 문제를 다항 시간에 해결할 수 있어 암호학에 혁명을 가져왔습니다.
        이 간소화 버전은 주기 찾기의 핵심 아이디어를 보여줍니다.
      `,
      circuit: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        { type: 'CNOT', qubit: 0, targetQubit: 2, step: 1 },
        { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 },
        { type: 'H', qubit: 0, step: 3 },
        { type: 'CNOT', qubit: 0, targetQubit: 1, step: 4 },
        { type: 'H', qubit: 1, step: 5 }
      ],
      preview: "Q0: |0⟩──H────●────H──●──────\nQ1: |0⟩──H───────●────⊕──H──\nQ2: |0⟩─────⊕──⊕──────────",
      applications: "암호 해독, 소인수분해"
    },
    {
      id: 'deutsch',
      name: 'Deutsch 알고리즘',
      icon: '⚖️',
      color: '#ef4444',
      hoverColor: '#dc2626',
      complexity: 'easy',
      description: `
        Deutsch 알고리즘은 함수가 상수함수인지 균형함수인지를 단 한 번의 함수 호출로 판단합니다.
        고전 컴퓨터는 최악의 경우 2번의 함수 호출이 필요하지만, 양자 컴퓨터는 1번만 필요합니다.
        양자 컴퓨팅의 우월성을 보여주는 첫 번째 알고리즘입니다.
      `,
      circuit: [
        { type: 'X', qubit: 1, step: 0 },
        { type: 'H', qubit: 0, step: 1 },
        { type: 'H', qubit: 1, step: 1 },
        { type: 'CNOT', qubit: 0, targetQubit: 1, step: 2 },
        { type: 'H', qubit: 0, step: 3 }
      ],
      preview: "Q0: |0⟩────H──●──H──\nQ1: |0⟩──X──H──⊕─────",
      applications: "함수 특성 판별, 양자 우월성 증명"
    },
    {
      id: 'simon',
      name: '사이먼 알고리즘',
      icon: '🧩',
      color: '#06b6d4',
      hoverColor: '#0891b2',
      complexity: 'medium',
      description: `
        사이먼 알고리즘은 블랙박스 함수의 숨겨진 주기를 찾는 알고리즘입니다.
        고전적으로는 지수 시간이 걸리는 문제를 다항 시간에 해결할 수 있습니다.
        이 알고리즘은 쇼어 알고리즘 개발에 영감을 주었습니다.
      `,
      circuit: [
        { type: 'H', qubit: 0, step: 0 },
        { type: 'H', qubit: 1, step: 0 },
        { type: 'CNOT', qubit: 0, targetQubit: 2, step: 1 },
        { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 },
        { type: 'CNOT', qubit: 0, targetQubit: 2, step: 3 },
        { type: 'H', qubit: 0, step: 4 },
        { type: 'H', qubit: 1, step: 4 }
      ],
      preview: "Q0: |0⟩──H────●────●──H──\nQ1: |0⟩──H───────●────H──\nQ2: |0⟩─────⊕──⊕──⊕─────",
      applications: "주기 찾기, 암호 분석"
    }
  ];

  // 회로 적용 핸들러
  const handleApplyCircuit = (algorithm) => {
    // 선택된 알고리즘 정보를 세션 스토리지에 저장
    sessionStorage.setItem('selectedAlgorithm', JSON.stringify({
      name: algorithm.name,
      gates: algorithm.circuit
    }));
    
    // CircuitBuilder 페이지로 이동
    navigate('/circuit-builder');
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>🧠 양자 알고리즘 템플릿</Title>
          <Subtitle>
            유명한 양자 알고리즘들을 배우고 직접 실행해보세요. 
            각 알고리즘의 회로를 적용하여 양자 시뮬레이터에서 결과를 확인할 수 있습니다.
          </Subtitle>
        </Header>

        <InfoSection>
          <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>💡 사용 방법</h2>
          <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
            <p>1. 관심 있는 양자 알고리즘을 선택하세요</p>
            <p>2. 알고리즘의 설명과 회로 구조를 확인하세요</p>
            <p>3. "회로 적용하기" 버튼을 클릭하여 시뮬레이터로 이동하세요</p>
            <p>4. 자동으로 로드된 회로를 실행하여 결과를 확인하세요</p>
          </div>
        </InfoSection>

        <AlgorithmGrid>
          {algorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.id} color={algorithm.color}>
              <AlgorithmHeader>
                <AlgorithmIcon color={algorithm.color}>
                  {algorithm.icon}
                </AlgorithmIcon>
                <div>
                  <AlgorithmName>{algorithm.name}</AlgorithmName>
                  <ComplexityBadge level={algorithm.complexity}>
                    {algorithm.complexity === 'easy' ? '초급' : 
                     algorithm.complexity === 'medium' ? '중급' : '고급'}
                  </ComplexityBadge>
                </div>
              </AlgorithmHeader>

              <AlgorithmDescription>
                {algorithm.description}
              </AlgorithmDescription>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#374151', marginBottom: '8px' }}>회로 구조:</h4>
                <CircuitPreview>
                  {algorithm.preview}
                </CircuitPreview>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#374151', marginBottom: '8px' }}>응용 분야:</h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {algorithm.applications}
                </p>
              </div>

              <ApplyButton
                color={algorithm.color}
                hoverColor={algorithm.hoverColor}
                onClick={() => handleApplyCircuit(algorithm)}
              >
                🚀 회로 적용하기
              </ApplyButton>
            </AlgorithmCard>
          ))}
        </AlgorithmGrid>

        <InfoSection>
          <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>📚 추가 학습 자료</h2>
          <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
            <p>• <strong>양자 컴퓨팅 기초:</strong> 큐비트, 양자 게이트, 얽힘에 대해 학습하세요</p>
            <p>• <strong>알고리즘 복잡도:</strong> 양자 알고리즘이 고전 알고리즘보다 빠른 이유를 이해하세요</p>
            <p>• <strong>실제 응용:</strong> 암호학, 최적화, 시뮬레이션에서의 양자 컴퓨팅 활용 사례</p>
          </div>
        </InfoSection>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AlgorithmTemplates;
