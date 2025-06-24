import React, { useState } from 'react';
import styled from 'styled-components';

const InfoPanelContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ConceptCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
`;

const ConceptTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConceptDescription = styled.p`
  margin-bottom: 12px;
  line-height: 1.5;
  opacity: 0.9;
`;

const FormulaBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border-left: 3px solid #fbbf24;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 10px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #fbbf24;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
`;

/**
 * 양자 물리학 핵심 개념 정보 패널
 * 얽힘, 위상, 슈퍼포지션 등을 시각적으로 설명
 */
const QuantumInfoPanel = ({ simulator, circuitGates }) => {
  const [activeTab, setActiveTab] = useState('concepts');

  // 양자 상태 분석 (시뮬레이터가 있을 때만)
  const quantumMetrics = simulator ? {
    entanglement: simulator.getEntanglementMeasure(),
    superposition: simulator.getSuperpositionCount(),
    phases: simulator.getPhaseInfo(),
    probabilities: simulator.getProbabilityDistribution()
  } : null;

  const concepts = {
    superposition: {
      icon: '🌀',
      title: '슈퍼포지션 (Superposition)',
      description: '큐비트가 |0⟩과 |1⟩의 조합 상태에 있는 것. 측정 전까지는 모든 가능한 상태가 동시에 존재합니다.',
      formula: '|ψ⟩ = α|0⟩ + β|1⟩\n|α|² + |β|² = 1',
      example: 'H 게이트: |0⟩ → (|0⟩ + |1⟩)/√2'
    },
    entanglement: {
      icon: '🔗',
      title: '얽힘 (Entanglement)',
      description: '두 개 이상의 큐비트가 서로 연결되어, 하나의 상태를 측정하면 다른 큐비트의 상태가 즉시 결정되는 현상입니다.',
      formula: '|ψ⟩ = (|00⟩ + |11⟩)/√2\n(Bell State)',
      example: 'CNOT 게이트로 얽힘 생성 가능'
    },
    phase: {
      icon: '〰️',
      title: '위상 (Phase)',
      description: '양자 상태의 복소수 계수에 나타나는 위상각. 측정 확률에는 영향을 주지 않지만 간섭 현상에 중요합니다.',
      formula: '|ψ⟩ = α|0⟩ + βe^(iφ)|1⟩\nφ: 위상각',
      example: 'Z 게이트: |1⟩ → -|1⟩ (π 위상 변화)'
    },
    interference: {
      icon: '🌊',
      title: '간섭 (Interference)',
      description: '양자 상태들이 서로 더해지거나 상쇄되는 현상. 양자 알고리즘의 핵심 원리입니다.',
      formula: '건설적 간섭: |ψ₁⟩ + |ψ₂⟩\n파괴적 간섭: |ψ₁⟩ - |ψ₂⟩',
      example: 'H-Z-H 시퀀스로 간섭 효과 관찰'
    }
  };

  const renderConcepts = () => (
    <div>
      {Object.entries(concepts).map(([key, concept]) => (
        <ConceptCard key={key}>
          <ConceptTitle>
            <span>{concept.icon}</span>
            {concept.title}
          </ConceptTitle>
          <ConceptDescription>
            {concept.description}
          </ConceptDescription>
          <FormulaBox>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fbbf24' }}>
              📐 수식:
            </div>
            <div style={{ whiteSpace: 'pre-line' }}>{concept.formula}</div>
            {concept.example && (
              <div style={{ marginTop: '8px', opacity: 0.8 }}>
                💡 예시: {concept.example}
              </div>
            )}
          </FormulaBox>
        </ConceptCard>
      ))}
    </div>
  );

  const renderAnalysis = () => {
    if (!quantumMetrics) {
      return (
        <ConceptCard>
          <ConceptDescription style={{ textAlign: 'center', fontSize: '1.1rem' }}>
            회로를 실행하면 양자 상태 분석이 표시됩니다
          </ConceptDescription>
        </ConceptCard>
      );
    }

    return (
      <div>
        <ConceptCard>
          <ConceptTitle>
            <span>📊</span>
            현재 양자 상태 분석
          </ConceptTitle>
          
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{quantumMetrics.entanglement.toFixed(3)}</MetricValue>
              <MetricLabel>얽힘 정도</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{quantumMetrics.superposition}</MetricValue>
              <MetricLabel>슈퍼포지션 항</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{quantumMetrics.phases.length}</MetricValue>
              <MetricLabel>위상 상태</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{Object.keys(quantumMetrics.probabilities).length}</MetricValue>
              <MetricLabel>가능한 결과</MetricLabel>
            </MetricCard>
          </MetricsGrid>

          {quantumMetrics.entanglement > 0.1 && (
            <FormulaBox style={{ marginTop: '12px' }}>
              <div style={{ color: '#fbbf24', marginBottom: '4px' }}>🔗 얽힘 감지!</div>
              <div>얽힘 정도: {(quantumMetrics.entanglement * 100).toFixed(1)}%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                큐비트들이 서로 연결되어 있습니다
              </div>
            </FormulaBox>
          )}

          {quantumMetrics.phases.some(p => Math.abs(p.phase) > 0.1) && (
            <FormulaBox style={{ marginTop: '8px' }}>
              <div style={{ color: '#fbbf24', marginBottom: '4px' }}>〰️ 위상 변화 감지!</div>
              {quantumMetrics.phases
                .filter(p => Math.abs(p.phase) > 0.1)
                .slice(0, 3)
                .map((p, i) => (
                  <div key={i} style={{ fontSize: '0.85rem' }}>
                    |{p.state}⟩: φ = {p.phase.toFixed(3)} rad
                  </div>
                ))}
            </FormulaBox>
          )}
        </ConceptCard>

        <ConceptCard>
          <ConceptTitle>
            <span>⚡</span>
            회로 복잡도 분석
          </ConceptTitle>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>게이트 종류별 개수:</div>
              {['H', 'X', 'Y', 'Z', 'CNOT'].map(gateType => {
                const count = circuitGates.filter(g => g.type === gateType).length;
                return count > 0 ? (
                  <div key={gateType} style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                    {gateType}: {count}개
                  </div>
                ) : null;
              })}
            </div>
            
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>회로 특성:</div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                총 게이트: {circuitGates.length}개
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                회로 깊이: {Math.max(...circuitGates.map(g => g.step + 1), 0)}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                얽힘 게이트: {circuitGates.filter(g => g.type === 'CNOT').length}개
              </div>
            </div>
          </div>
        </ConceptCard>
      </div>
    );
  };

  return (
    <InfoPanelContainer>
      <Title>
        🧠 양자 물리학 정보
      </Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'concepts'} 
          onClick={() => setActiveTab('concepts')}
        >
          핵심 개념
        </Tab>
        <Tab 
          active={activeTab === 'analysis'} 
          onClick={() => setActiveTab('analysis')}
        >
          상태 분석
        </Tab>
      </TabContainer>

      {activeTab === 'concepts' ? renderConcepts() : renderAnalysis()}
    </InfoPanelContainer>
  );
};

export default QuantumInfoPanel; 