import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 400px;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QubitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0 24px 0;
`;

const QubitButton = styled.button`
  padding: 16px;
  border: 2px solid ${props => 
    props.isControl ? '#10b981' : 
    props.isTarget ? '#f59e0b' : 
    props.isDisabled ? '#d1d5db' : '#e5e7eb'
  };
  background: ${props => 
    props.isControl ? '#d1fae5' : 
    props.isTarget ? '#fef3c7' : 
    props.isDisabled ? '#f9fafb' : 'white'
  };
  border-radius: 8px;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  color: ${props => 
    props.isControl ? '#065f46' : 
    props.isTarget ? '#92400e' : 
    props.isDisabled ? '#9ca3af' : '#374151'
  };
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => props.isDisabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.isDisabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 0.875rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${props => props.color};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover { background: #2563eb; }
    &:disabled { background: #9ca3af; cursor: not-allowed; }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.875rem;
`;

const InfoMessage = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.875rem;
`;

/**
 * CNOT 게이트 설정 모달
 * 제어 큐비트와 타깃 큐비트를 선택할 수 있게 해주는 컴포넌트
 */
const CNOTModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  numQubits, 
  occupiedQubits = [], // 이미 게이트가 있는 큐비트들
  step 
}) => {
  const [controlQubit, setControlQubit] = useState(null);
  const [targetQubit, setTargetQubit] = useState(null);
  const [error, setError] = useState('');

  // 모달이 열릴 때마다 상태 초기화
  React.useEffect(() => {
    if (isOpen) {
      setControlQubit(null);
      setTargetQubit(null);
      setError('');
    }
  }, [isOpen]);

  // 큐비트 선택 핸들러
  const handleQubitClick = (qubitIndex) => {
    setError(''); // 에러 메시지 초기화
    
    // 이미 점유된 큐비트인지 확인
    if (occupiedQubits.includes(qubitIndex)) {
      setError(`Q${qubitIndex}에는 이미 다른 게이트가 있습니다.`);
      return;
    }
    
    // 첫 번째 선택: 제어 큐비트 설정
    if (controlQubit === null) {
      setControlQubit(qubitIndex);
    } 
    // 두 번째 선택: 타깃 큐비트 설정
    else if (targetQubit === null) {
      if (qubitIndex === controlQubit) {
        setError('제어 큐비트와 타깃 큐비트는 달라야 합니다.');
        return;
      }
      setTargetQubit(qubitIndex);
    } 
    // 재선택: 기존 선택 초기화 후 새로 시작
    else {
      setControlQubit(qubitIndex);
      setTargetQubit(null);
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (controlQubit === null || targetQubit === null) {
      setError('제어 큐비트와 타깃 큐비트를 모두 선택해주세요.');
      return;
    }
    
    onConfirm(controlQubit, targetQubit);
    onClose();
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    setControlQubit(null);
    setTargetQubit(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleCancel}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>
          <span>⊕</span>
          CNOT 게이트 설정 (Step {step + 1})
        </ModalTitle>
        
        <InfoMessage>
          💡 먼저 제어 큐비트를 선택하고, 다음에 타깃 큐비트를 선택하세요.
        </InfoMessage>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Legend>
          <LegendItem>
            <LegendColor color="#d1fae5" />
            <span>제어 큐비트</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#fef3c7" />
            <span>타깃 큐비트</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#f9fafb" />
            <span>사용 불가</span>
          </LegendItem>
        </Legend>
        
        <QubitGrid>
          {Array.from({ length: numQubits }, (_, index) => {
            const isOccupied = occupiedQubits.includes(index);
            const isControl = controlQubit === index;
            const isTarget = targetQubit === index;
            
            return (
              <QubitButton
                key={index}
                isControl={isControl}
                isTarget={isTarget}
                isDisabled={isOccupied}
                onClick={() => handleQubitClick(index)}
                disabled={isOccupied}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  Q{index}
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  {isControl ? '제어' : isTarget ? '타깃' : isOccupied ? '사용중' : '선택'}
                </div>
              </QubitButton>
            );
          })}
        </QubitGrid>
        
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
          {controlQubit !== null && targetQubit !== null ? 
            `Q${controlQubit} (제어) → Q${targetQubit} (타깃)` :
            controlQubit !== null ? 
            `Q${controlQubit} (제어) 선택됨. 타깃 큐비트를 선택하세요.` :
            '제어 큐비트를 먼저 선택하세요.'
          }
        </div>
        
        <ButtonGroup>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm}
            disabled={controlQubit === null || targetQubit === null}
          >
            확인
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CNOTModal; 