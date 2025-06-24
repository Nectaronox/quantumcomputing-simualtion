import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components';

const VisualizationContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const StatCard = styled.div`
  background: ${props => props.bgColor || '#f3f4f6'};
  padding: 12px;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color || '#1f2937'};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #e0e7ff;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #4338ca;
`;

/**
 * 향상된 양자 회로 결과 시각화 컴포넌트
 * recharts를 사용한 확률 분포 막대 그래프와 상세 통계 정보 제공
 * 실시간 애니메이션 및 단계별 변화 지원
 */
const ResultVisualization = ({ 
  results, 
  stepInfo = null, // { current: 1, total: 5, gateName: 'H' }
  onStepChange = null,
  showAnimation = false 
}) => {
  // 결과 데이터가 없으면 빈 상태 표시
  if (!results || Object.keys(results).length === 0) {
    return (
      <VisualizationContainer>
        <Title>📊 측정 결과</Title>
        <div style={{ 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '1.1rem'
        }}>
          회로를 실행하면 측정 결과가 여기에 표시됩니다
        </div>
      </VisualizationContainer>
    );
  }

  // recharts용 데이터 변환
  const chartData = Object.entries(results)
    .map(([state, count]) => ({
      state,
      count,
      probability: count / Object.values(results).reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => parseInt(a.state, 2) - parseInt(b.state, 2));

  // 통계 계산
  const totalShots = Object.values(results).reduce((a, b) => a + b, 0);
  const numStates = Object.keys(results).length;
  const maxProbability = Math.max(...chartData.map(d => d.probability));
  const entropy = chartData.reduce((acc, d) => {
    const p = d.probability;
    return p > 0 ? acc - p * Math.log2(p) : acc;
  }, 0);

  // 막대 색상 결정 (확률에 따라)
  const getBarColor = (probability) => {
    if (probability > 0.5) return '#dc2626'; // 빨강 (높은 확률)
    if (probability > 0.3) return '#ea580c'; // 주황
    if (probability > 0.1) return '#ca8a04'; // 노랑
    if (probability > 0.05) return '#16a34a'; // 초록
    return '#2563eb'; // 파랑 (낮은 확률)
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>상태: |{label}⟩</p>
          <p style={{ margin: '4px 0 0 0', color: '#4f46e5' }}>
            측정 횟수: {data.count}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#059669' }}>
            확률: {(data.probability * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <VisualizationContainer>
      <Title>
        📊 측정 결과
        {showAnimation && <div style={{ 
          width: '8px', 
          height: '8px', 
          background: '#10b981', 
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />}
      </Title>

      {stepInfo && (
        <StepIndicator>
          <span>단계 {stepInfo.current}/{stepInfo.total}</span>
          <span>•</span>
          <span>{stepInfo.gateName} 게이트 적용 완료</span>
          {onStepChange && (
            <input
              type="range"
              min="0"
              max={stepInfo.total}
              value={stepInfo.current}
              onChange={(e) => onStepChange(parseInt(e.target.value))}
              style={{ marginLeft: 'auto', width: '120px' }}
            />
          )}
        </StepIndicator>
      )}

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="state" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              label={{ 
                value: '측정 횟수', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.probability)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <StatsGrid>
        <StatCard bgColor="#fef3c7">
          <StatValue color="#d97706">{totalShots.toLocaleString()}</StatValue>
          <StatLabel>총 측정 횟수</StatLabel>
        </StatCard>
        
        <StatCard bgColor="#d1fae5">
          <StatValue color="#059669">{numStates}</StatValue>
          <StatLabel>관측된 상태 수</StatLabel>
        </StatCard>
        
        <StatCard bgColor="#dbeafe">
          <StatValue color="#2563eb">{(maxProbability * 100).toFixed(1)}%</StatValue>
          <StatLabel>최대 확률</StatLabel>
        </StatCard>
        
        <StatCard bgColor="#e0e7ff">
          <StatValue color="#4338ca">{entropy.toFixed(2)}</StatValue>
          <StatLabel>엔트로피</StatLabel>
        </StatCard>
      </StatsGrid>
    </VisualizationContainer>
  );
};

export default ResultVisualization; 