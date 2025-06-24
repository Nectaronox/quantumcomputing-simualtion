import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: ${props => {
    if (props.variant === 'primary') return '#3b82f6';
    if (props.variant === 'secondary') return '#6366f1';
    if (props.variant === 'danger') return '#ef4444';
    return '#6b7280';
  }};
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ProgressContainer = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ProgressBar = styled.div`
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  background: linear-gradient(to right, #3b82f6, #6366f1);
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
`;

const SliderContainer = styled.div`
  margin-top: 12px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => {
    if (props.status === 'running') return '#dcfce7';
    if (props.status === 'step') return '#fef3c7';
    if (props.status === 'completed') return '#dbeafe';
    return '#f3f4f6';
  }};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => {
    if (props.status === 'running') return '#166534';
    if (props.status === 'step') return '#92400e';
    if (props.status === 'completed') return '#1e40af';
    return '#6b7280';
  }};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    if (props.status === 'running') return '#16a34a';
    if (props.status === 'step') return '#eab308';
    if (props.status === 'completed') return '#3b82f6';
    return '#9ca3af';
  }};
  ${props => props.status === 'running' && 'animation: pulse 2s infinite;'}
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const SpeedLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const SpeedSlider = styled(Slider)`
  flex: 1;
  max-width: 150px;
`;

/**
 * 양자 회로 실행 컨트롤 컴포넌트
 * 즉시 실행, 스텝 실행, 속도 조절 등의 기능 제공
 */
const StepControls = ({
  onRun,
  onSlowRun,
  onStop,
  onPause,
  onStepChange,
  runStatus = 'idle', // 'idle' | 'running' | 'step' | 'completed'
  isPaused = false,
  currentStep = 0,
  totalSteps = 0,
  speed = 500, // 스텝 간 딜레이 (ms)
  onSpeedChange,
  circuitGates = [],
  canRun = true
}) => {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const getStatusInfo = () => {
    switch (runStatus) {
      case 'running':
        return { text: '즉시 실행 중...', icon: '⚡' };
      case 'step':
        return { text: '단계별 실행 중...', icon: '👣' };
      case 'completed':
        return { text: '실행 완료', icon: '✅' };
      default:
        return { text: '대기 중', icon: '⏸️' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <ControlsContainer>
      <Title>
        ⚡ 실행 컨트롤
      </Title>

      <ButtonGroup>
        <Button
          variant="primary"
          onClick={onRun}
          disabled={!canRun || runStatus === 'running' || runStatus === 'step'}
        >
          <span>⚡</span>
          즉시 실행
        </Button>

        <Button
          variant="secondary"
          onClick={onSlowRun}
          disabled={!canRun || runStatus === 'running' || runStatus === 'step'}
        >
          <span>👣</span>
          단계별 실행
        </Button>

        {runStatus === 'step' && (
          <Button
            variant="secondary"
            onClick={onPause}
          >
            <span>{isPaused ? '▶️' : '⏸️'}</span>
            {isPaused ? '재시작' : '일시정지'}
          </Button>
        )}

        <Button
          variant="danger"
          onClick={onStop}
          disabled={runStatus === 'idle' || runStatus === 'completed'}
        >
          <span>⏹️</span>
          정지
        </Button>
      </ButtonGroup>

      {totalSteps > 0 && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <ProgressText>
            <span>단계 {currentStep} / {totalSteps}</span>
            <span>{progress.toFixed(0)}% 완료</span>
          </ProgressText>
          
          {runStatus === 'step' && onStepChange && (
            <SliderContainer>
              <Slider
                type="range"
                min="0"
                max={totalSteps}
                value={currentStep}
                onChange={(e) => onStepChange(parseInt(e.target.value))}
              />
            </SliderContainer>
          )}
        </ProgressContainer>
      )}

      <StatusIndicator status={runStatus}>
        <StatusDot status={runStatus} />
        <span>{statusInfo.icon} {statusInfo.text}</span>
      </StatusIndicator>

      {runStatus === 'step' && onSpeedChange && (
        <SpeedControl>
          <SpeedLabel>실행 속도:</SpeedLabel>
          <SpeedSlider
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          />
          <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '60px' }}>
            {speed}ms
          </span>
        </SpeedControl>
      )}

      {circuitGates.length === 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '12px',
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          💡 회로에 게이트를 배치한 후 실행할 수 있습니다
        </div>
      )}

      {circuitGates.length > 0 && canRun && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '12px',
          fontSize: '0.875rem',
          color: '#065f46'
        }}>
          ✨ {circuitGates.length}개 게이트가 배치되었습니다. 실행 준비 완료!
        </div>
      )}
    </ControlsContainer>
  );
};

export default StepControls; 